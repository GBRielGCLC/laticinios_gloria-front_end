import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IItem, IItemVendaPOST, ItemService, IVendaPOST } from "../../../Services/Api/Item";
import { yup } from "../../../Yup";
import { toast } from "react-toastify";

// Tipagem para auxiliar na lógica interna do formulário
interface ItemFormData {
    itemId: number;
    quantidade: number;
}

export function useFormVenda() {
    const [itens, setItens] = useState<IItem[]>([]);
    const [carrinho, setCarrinho] = useState<IItemVendaPOST[]>([]);
    const [loading, setLoading] = useState(false);

    // FORM PARA ADICIONAR ITEM
    const schema: yup.ObjectSchema<ItemFormData> = yup.object({
        itemId: yup
            .number()
            .required("Selecione um item"),

        quantidade: yup
            .number()
            .required("Informe a quantidade")
            .min(1, "Quantidade mínima é 1")
            .test(
                "estoque",
                "Quantidade maior que o estoque",
                function (value) {
                    const parent = this.parent as ItemFormData;
                    const selected = itens.find(i => i.id === parent.itemId);
                    if (!selected || !value) return true;

                    const qCarrinho = carrinho
                        .filter(c => c.itemId === parent.itemId)
                        .reduce((acc, c) => acc + c.quantidade, 0);

                    return value + qCarrinho <= selected.lote.quantidade;
                }
            )
    }).required();

    const { control, watch, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            itemId: null as any,
            quantidade: undefined,
        }
    });

    const itemId = watch("itemId");
    const quantidade = watch("quantidade");

    // FORM FINAL (PGTO + OBS)
    const { control: controlFinal, handleSubmit: handleSubmitFinal } = useForm({
        defaultValues: {
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


    const registrarVenda = async (dadosExtras: { formaPagamento: number; observacoes?: string }) => {
        const payload: IVendaPOST = {
            itens: carrinho,
            dataVenda: dayjs().toISOString(),
            valorTotal,
            formaPagamento: dadosExtras.formaPagamento,
            observacoes: dadosExtras.observacoes
        };

        console.log("🚀 Venda enviada:", payload);
    };

    return {
        control,
        errors,
        handleSubmit: handleSubmit(adicionarAoCarrinho),

        controlFinal,
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