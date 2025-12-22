import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
    IListarVendasProps,
    VendaService,
    IVendaGET,
} from "../../Services/Api/Venda";
import { defaultPaginationsData } from "../../Services/Api/Utils";
import { useConfirm } from "../../Contexts";

export interface IFiltroVendaForm {
    dataVenda: dayjs.Dayjs | null;
    formaPagamento: string;
    observacoes: string;
}

export const useVenda = () => {
    const confirmDialog = useConfirm();

    const [isLoadingVenda, setIsLoadingVenda] = useState(false);

    const [vendas, setVendas] = useState<IVendaGET>({
        dados: [
            {
                id: 1,
                dataVenda: "2025-02-10T14:32:00",
                valorTotal: 120.0,
                formaPagamento: "Pix",
                observacoes: "Cliente pediu nota fiscal",
                itens: []
            },
            {
                id: 2,
                dataVenda: "2025-02-10T16:10:00",
                valorTotal: 89.9,
                formaPagamento: "Cartão de Crédito",
                itens: []
            },
            {
                id: 3,
                dataVenda: "2025-02-09T11:45:00",
                valorTotal: 45.0,
                formaPagamento: "Dinheiro",
                observacoes: "Pagamento em dinheiro",
                itens: []
            },
        ],
        totalPaginas: 5,
        totalRegistros: 5,
    });

    const [pagination, setPagination] = useState(defaultPaginationsData);

    const form = useForm<IFiltroVendaForm>({
        defaultValues: {
            dataVenda: null,
            formaPagamento: "",
            observacoes: "",
        },
    });

    const listarVendas = useCallback((query?: IListarVendasProps) => {
        setIsLoadingVenda(true);

        VendaService.listarVendas({
            pagination: query?.pagination ?? pagination,
            filtros: query?.filtros,
        }).then((result) => {
            setIsLoadingVenda(false);

            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            result.dados.length > 0 && setVendas(result);
        });
    },
        [pagination]
    );

    const handleBuscar = form.handleSubmit((data) => {
        listarVendas({
            filtros: {
                dataVenda: data.dataVenda
                    ? data.dataVenda.format("YYYY-MM-DD")
                    : null,
                formaPagamento: data.formaPagamento || null,
                observacoes: data.observacoes || null,
            },
            pagination: {
                ...pagination,
                pagina: 1,
            },
        });

        setPagination(prev => ({
            ...prev,
            pagina: 1,
        }));
    });

    const handleChangePage = (_: React.ChangeEvent<unknown>, pagina: number) => {
        const newPagination = {
            ...pagination,
            pagina,
        };

        setPagination(newPagination);
        listarVendas({ pagination: newPagination });
    };

    const handleDelete = (id: number) => {
        confirmDialog({
            titulo: "Excluir venda",
            conteudo: "Tem certeza que deseja excluir esta venda?",
            onConfirm: ({ close, setLoading }) =>
                VendaService.excluirVenda(id).then((result) => {
                    setLoading(false);

                    if (result instanceof Error) {
                        toast.error(result.message);
                        return;
                    }

                    toast.success("Venda excluída com sucesso!");
                    close();

                    setVendas(prev => ({
                        ...prev,
                        dados: prev.dados.filter(v => v.id !== id),
                        totalRegistros: prev.totalRegistros - 1,
                    }));
                }),
        });
    };

    useEffect(() => {
        listarVendas({ pagination });
    }, []);

    return {
        vendas,
        isLoadingVenda,

        pagination,
        handleChangePage,

        form,
        handleBuscar,
        handleDelete,
    };
};