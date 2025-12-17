// Hooks/useVenda.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IListarVendasProps, VendaService, IVendaGET } from "../../Services/Api/Venda";
import { defaultPaginationsData } from "../../Services/Api/Utils";

export const useVenda = () => {
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
        totalPaginas: 0,
        totalRegistros: 0,
    });
    const [pagination, setPagination] = useState(defaultPaginationsData);

    const listarVendas = useCallback((query?: IListarVendasProps) => {
        setIsLoadingVenda(true);

        VendaService.listarVendas({
            pagination: query?.pagination ?? pagination,
        }).then((result) => {
            setIsLoadingVenda(false);

            if (result instanceof Error) {
                toast.error(result.message);
                setVendas({
                    dados: [],
                    totalPaginas: 0,
                    totalRegistros: 0
                });
                return;
            }

            setVendas(result);
        });
    }, [pagination]);

    useEffect(() => {
        // listarVendas();
    }, []);

    return {
        vendas,
        setVendas,
        isLoadingVenda,
        pagination,
        setPagination,
        listarVendas,
    };
};