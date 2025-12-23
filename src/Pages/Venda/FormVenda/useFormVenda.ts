import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IItem, IItemVendaPOST, ItemService, } from "../../../Services/Api/Item";
import { yup } from "../../../Yup";
import { toast } from "react-toastify";
import { VendaService, IVendaPOST } from "../../../Services/Api/Venda";

import { createItemVendaSchema, ItemFormData, schemaFinal } from "./schemas";

export function useFormVenda() {
    const [itens, setItens] = useState<IItem[]>([]);
    const [carrinho, setCarrinho] = useState<IItemVendaPOST[]>([]);
    const [loading, setLoading] = useState(false);

    const schema = useMemo(
        () => createItemVendaSchema(itens, carrinho),
        [itens, carrinho]
    );

    const { control, watch, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            itemId: null as any,
            quantidade: undefined,
        }
    });

    const itemId = watch("itemId");
    const quantidade = watch("quantidade");

    const { control: controlFinal, handleSubmit: handleSubmitFinal, reset: resetFinal, formState: { errors: errorsFinal } } = useForm({
        resolver: yupResolver(schemaFinal),
        defaultValues: {
            dataVenda: null,
            formaPagamento: 1,
            observacoes: "",
        }
    });

    const selectedItem = useMemo(() => {
        return itens.find(i => i.id === itemId);
    }, [itemId, itens]);

    const valorItem = useMemo(() => {
        if (!selectedItem) return 0;
        return selectedItem.produto.precoUnitario * (Number(quantidade) || 0);
    }, [selectedItem, quantidade]);

    const calcularValorTotal = useCallback((currentCarrinho: IItemVendaPOST[]) => {
        return currentCarrinho.reduce((acc, itemCar) => {
            const itemCompleto = itens.find(i => i.id === itemCar.itemId);
            if (!itemCompleto) return acc;
            return acc + itemCompleto.produto.precoUnitario * itemCar.quantidade;
        }, 0);
    }, [itens]);

    const valorTotal = useMemo(() => calcularValorTotal(carrinho), [carrinho, calcularValorTotal]);

    const getDadosSelects = useCallback(() => {
        ItemService.listarItens().then((result) => {
            if (result instanceof Error) {
                setItens([]);
                toast.error(result.message);
                return;
            }
            setItens(result.dados);
        });
    }, []);

    useEffect(() => {
        getDadosSelects();
    }, [getDadosSelects]);

    const adicionarAoCarrinho: SubmitHandler<ItemFormData> = useCallback((data) => {
        if (!data.itemId || !data.quantidade) return;

        setCarrinho(prev => {
            const itemIndex = prev.findIndex(item => item.itemId === data.itemId);

            if (itemIndex !== -1) {
                // Item já existe: atualiza a quantidade
                const newCarrinho = [...prev];
                newCarrinho[itemIndex] = {
                    ...newCarrinho[itemIndex],
                    quantidade: newCarrinho[itemIndex].quantidade + Number(data.quantidade),
                };
                return newCarrinho;
            } else {
                // Item novo: adiciona
                return [
                    ...prev,
                    {
                        itemId: data.itemId as number,
                        quantidade: Number(data.quantidade),
                    }
                ];
            }
        });

        reset();
    }, [reset]);

    const editarQuantidadeItem = useCallback((itemId: number, novaQuantidade: number) => {
        // Encontra o item original (para pegar o estoque)
        const itemCompleto = itens.find(i => i.id === itemId);

        if (!itemCompleto) {
            toast.error("Item não encontrado para edição.");
            return;
        }

        // Valida se a nova quantidade não excede o estoque
        if (novaQuantidade <= 0) {
            toast.warning("A quantidade mínima deve ser 1. Use o botão de lixeira para remover.");
            return;
        }
        if (novaQuantidade > itemCompleto.lote.quantidade) {
            toast.warn(`Quantidade excede o estoque disponível (${itemCompleto.lote.quantidade}).`);
            return;
        }

        // Atualiza o carrinho
        setCarrinho(prev => {
            const itemIndex = prev.findIndex(item => item.itemId === itemId);
            if (itemIndex === -1) return prev;

            const newCarrinho = [...prev];
            newCarrinho[itemIndex] = {
                ...newCarrinho[itemIndex],
                quantidade: novaQuantidade,
            };
            return newCarrinho;
        });
    }, [itens]);


    const removerItem = useCallback((itemId: number) => {
        setCarrinho(prev => prev.filter(item => item.itemId !== itemId));
    }, []);


    const registrarVenda = async (dadosExtras: {
        dataVenda: Dayjs | null;
        formaPagamento: number;
        observacoes?: string
    }) => {
        if (!dadosExtras.dataVenda) {
            toast.warning("Informe a data da venda");
            return;
        }

        const payload: IVendaPOST = {
            itens: carrinho,
            valorTotal,
            formaPagamento: dadosExtras.formaPagamento,
            observacoes: dadosExtras.observacoes,
            dataVenda: dadosExtras.dataVenda.format('YYYY-MM-DDTHH:mm:ss.SSS')
        };

        console.log(payload);

        /* VendaService.cadastrarVenda(payload).then((result) => {
            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            toast.success("Venda cadastrada com sucesso!");
            reset();
            resetFinal();
            setCarrinho([]);
        }); */
    };

    return {
        control,
        errors,
        handleSubmit: handleSubmit(adicionarAoCarrinho),

        controlFinal,
        errorsFinal,
        handleSubmitFinal: handleSubmitFinal(registrarVenda),

        itens,
        selectedItem,

        carrinho,
        valorItem,
        valorTotal,

        removerItem,
        editarQuantidadeItem,
    };
}