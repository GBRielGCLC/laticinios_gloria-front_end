import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IItem, IItemVendaPOST, ItemService, IVendaPOST } from "../../Services/Api/Item";
import { yup } from "../../Yup";
import { toast } from "react-toastify";

// Tipagem para auxiliar na lógica interna do formulário
interface ItemFormData {
    itemId: number | undefined;
    quantidade: number | undefined;
}

export function useFormVenda() {
    const [itens, setItens] = useState<IItem[]>([]);
    const [carrinho, setCarrinho] = useState<IItemVendaPOST[]>([]);
    const [loading, setLoading] = useState(false);

    // FORM PARA ADICIONAR ITEM
    const schema = yup.object<ItemFormData>({
        itemId: yup.number().required("Selecione um item"),
        quantidade: yup
            .number()
            .required("Informe a quantidade")
            .min(1, "Quantidade mínima é 1")
            .test("estoque", "Quantidade maior que o estoque", function (value) {
                const selected = itens.find(i => i.id === this.parent.itemId);
                if (!selected || !value) return true;

                const quantidadeAtualNoCarrinho = carrinho
                    .filter(c => c.itemId === this.parent.itemId)
                    .reduce((acc, curr) => acc + curr.quantidade, 0);

                const quantidadeTotalDesejada = value + quantidadeAtualNoCarrinho;

                return quantidadeTotalDesejada <= selected.lote.quantidade;
            })
    });

    const { control, watch, handleSubmit, reset, formState: { errors } } = useForm<ItemFormData>({
        // @ts-expect-error
        resolver: yupResolver(schema),
        defaultValues: {
            itemId: undefined,
            quantidade: undefined,
        }
    });

    const itemId = watch("itemId");
    const quantidade = watch("quantidade");

    useEffect(() => {
        if (itemId !== undefined) {
            reset({ itemId: itemId, quantidade: undefined });
        } else {
            reset({ itemId: undefined, quantidade: undefined });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId]);

    const selectedItem = useMemo(() => {
        return itens.find(i => i.id === itemId);
    }, [itemId, itens]);

    const valorItem = useMemo(() => {
        if (!selectedItem) return 0;
        return selectedItem.produto.precoUnitario * (Number(quantidade) || 0);
    }, [selectedItem, quantidade]);

    // Função auxiliar para calcular o total geral (simplifica o código)
    const calcularValorTotal = useCallback((currentCarrinho: IItemVendaPOST[]) => {
        return currentCarrinho.reduce((acc, itemCar) => {
            const itemCompleto = itens.find(i => i.id === itemCar.itemId);
            if (!itemCompleto) return acc;
            return acc + itemCompleto.produto.precoUnitario * itemCar.quantidade;
        }, 0);
    }, [itens]);

    const valorTotal = useMemo(() => calcularValorTotal(carrinho), [carrinho, calcularValorTotal]);

    const getDadosSelects = useCallback(() => {
        // ... (lógica de carregamento de itens permanece a mesma)
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

    // ADICIONAR ITEM AO CARRINHO (Lógica alterada para agrupar)
    const adicionarAoCarrinho = useCallback((data: ItemFormData) => {
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

        reset({ itemId: undefined, quantidade: undefined });
    }, [reset]);

    // NOVA FUNÇÃO: Editar a quantidade de um item no carrinho
    const editarQuantidadeItem = useCallback((itemId: number, novaQuantidade: number) => {
        // 1. Encontra o item original (para pegar o estoque)
        const itemCompleto = itens.find(i => i.id === itemId);

        if (!itemCompleto) {
            toast.error("Item não encontrado para edição.");
            return;
        }

        // 2. Valida se a nova quantidade não excede o estoque
        if (novaQuantidade <= 0) {
            toast.error("A quantidade mínima deve ser 1. Use o botão de lixeira para remover.");
            return;
        }
        if (novaQuantidade > itemCompleto.lote.quantidade) {
            toast.error(`Quantidade excede o estoque disponível (${itemCompleto.lote.quantidade}).`);
            return;
        }

        // 3. Atualiza o carrinho
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
        // Agora remove o item pelo itemId, já que eles estão agrupados
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
        itens,
        control,
        errors,
        carrinho,
        selectedItem,
        valorItem,
        valorTotal,
        adicionarAoCarrinho,
        removerItem,
        editarQuantidadeItem,
        registrarVenda,
        watch,
    };
}