import { useEffect, useState } from "react";
import { ILote, ILoteGET, LoteService } from "../../Services/Api/Lote";
import { toast } from "react-toastify";
import { ProdutoService } from "../../Services/Api/Produto";
import { get } from "http";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ActionButtons } from "../../Components/PersonalizedDataGrid/ActionButtons";

export const useLote = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ILote | null>(null);

    const [isLoadingLote, setIsLoadingLote] = useState(false);

    const [lotes, setLotes] = useState<ILoteGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });

    const columns: GridColDef<ILote>[] = [
        {
            field: 'numeroLote',
            headerName: 'Nº do Lote',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'quantidade',
            headerName: 'Quantidade',
            flex: 1,
            type: 'number',
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'valorLoteCompra',
            headerName: 'Valor da Compra',
            flex: 1,
            type: 'number',
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params: GridRenderCellParams) => {
                if (params.value == null) {
                    return '';
                }
                return params.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                });
            },
        },
        {
            field: 'dataCompra',
            headerName: 'Data Compra',
            flex: 1,
            type: 'date',
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridRenderCellParams) => {
                // Converte a string YYYY-MM-DD para um objeto Date para a ordenação correta
                if (!params.value) return null;
                return new Date(params.value);
            },
            valueFormatter: (params: GridRenderCellParams) => {
                if (params?.value == null) {
                    return '';
                }
                // Formata a data como string
                const date = new Date(params.value);
                return date.toLocaleDateString('pt-BR');
            },
        },
        {
            field: 'dataValidade',
            headerName: 'Data Validade',
            flex: 1,
            type: 'date',
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridRenderCellParams) => {
                if (!params.value) return null;
                return new Date(params.value);
            },
            valueFormatter: (params: GridRenderCellParams) => {
                if (params?.value == null) {
                    return '';
                }
                const date = new Date(params.value);
                return date.toLocaleDateString('pt-BR');
            },
        },
        /* {
            field: 'itens',
            headerName: 'Itens (Detalhes)',
            flex: 1,
            width: 140,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            // Exibe a contagem de itens
            valueGetter: (params: GridRenderCellParams) => {
                return params.row.itens ? `${params.row.itens.length} itens` : '0 itens';
            },
        }, */
        {
            field: 'actions',
            headerName: 'Ações',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => ActionButtons({
                params,
                onEdit: handleEditProduct,
                // onDelete: () => { },
            }),
        },
    ];

    const getLotes = () => {
        setIsLoadingLote(true);

        LoteService.listarLotes().then((result) => {
            setIsLoadingLote(false);

            if (result instanceof Error) {
                setLotes({ dados: [], totalPaginas: 0, totalRegistros: 0 });

                toast.error(result.message);
                return;
            }

            result.dados.map((lote, index) => {
                lote.id = index;
            });

            setLotes(result);
        })
    };

    useEffect(() => {
        if (lotes.dados.length > 0) return;

        getLotes();
    }, [getLotes])

    const handleEditProduct = (produto: ILote) => {
        setEditingProduct(produto);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    return {
        getLotes,
        lotes,
        isLoadingLote,
        columns,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,
    }
}