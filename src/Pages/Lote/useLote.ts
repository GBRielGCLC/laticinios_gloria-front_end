import { useCallback, useEffect, useState } from "react";
import { IFiltroLote, IListarLotesProps, ILote, ILoteGET, LoteService } from "../../Services/Api/Lote";
import { toast } from "react-toastify";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { ActionButtons } from "../../Components/PersonalizedDataGrid/ActionButtons";
import dayjs from "dayjs";
import { useConfirm } from "../../Contexts";
import { defaultPaginationsData, IPagination } from "../../Services/Api/Utils";

export const useLote = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ILote | null>(null);

    const [isLoadingLote, setIsLoadingLote] = useState(false);

    const [lotes, setLotes] = useState<ILoteGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });

    const [pagination, setPagination] = useState(defaultPaginationsData);

    const confirmDialog = useConfirm();

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
            valueFormatter: (value: number | null) => {
                if (!value || typeof value !== 'number') {
                    return '';
                }

                return value.toLocaleString('pt-BR', {
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
            valueFormatter: (value: string) => {
                if (!value) return '';

                return dayjs(value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'dataValidade',
            headerName: 'Data Validade',
            flex: 1,
            type: 'date',
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (value: string) => {
                if (!value) return '';

                return dayjs(value).format('DD/MM/YYYY');
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
                onDelete: () => {
                    confirmDialog({
                        titulo: 'Excluir Lote',
                        conteudo: 'Tem certeza que deseja excluir o lote?',
                        onConfirm: ({ close, setLoading }) => handleDeleteLote({
                            id: params.row.id,
                            setLoading,
                            close
                        })
                    })
                },
            }),
        },
    ];

    const listAllLotes = useCallback((query?: IListarLotesProps) => {
        setIsLoadingLote(true);

        if (!query) query = {};
        if (!query.pagination) query.pagination = pagination;
        if (!query.filtros) query.filtros = filtros;

        LoteService.listarLotes(query).then((result) => {
            setIsLoadingLote(false);

            if (result instanceof Error) {
                setLotes({ dados: [], totalPaginas: 0, totalRegistros: 0 });

                toast.error(result.message);
                return;
            }

            setLotes(result);
        })
    }, []);

    useEffect(() => {
      listAllLotes({ pagination, filtros });
    }, []);

    const handlePageChange = (model: GridPaginationModel) => {
        const modelPagination = {
            pagina: model.page + 1,
            tamanhoPagina: model.pageSize
        }

        setPagination(modelPagination);
        listAllLotes({ pagination: modelPagination, filtros });
    };

    const handleEditProduct = (produto: ILote) => {
        setEditingProduct(produto);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    interface HandleDeleteLoteProps {
        id: any;
        setLoading: (v: boolean) => void
        close: () => void;
    }
    const handleDeleteLote = (props: HandleDeleteLoteProps) => {
        props.setLoading(true);

        LoteService.excluirLote(props.id).then((result) => {
            props.setLoading(false);

            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            toast.success("Lote excluido com sucesso!");
            listAllLotes({ pagination, filtros });
            props.close();
        })
    }

    const [openFiltro, setOpenFiltro] = useState(false);
    const [filtros, setFiltros] = useState<IFiltroLote>();

    const handleFiltrar = (filter: IFiltroLote) => {
        /* const newPagination: IPagination = {
            pagina: 1,
            tamanhoPagina: pagination.tamanhoPagina
        }

        setPagination(newPagination);
        setFiltros(filter);

        listAllLotes({ pagination: newPagination, filtros: filter }); */
        setFiltros(filter);
        listAllLotes({ filtros: filter, pagination });
        setOpenFiltro(false);
    }


    return { 
        listAllLotes,
        lotes,
        isLoadingLote,
        columns,

        pagination, handlePageChange,

        isFormOpen,
        setIsFormOpen,
        editingProduct,
        handleCloseForm,

        openFiltro, setOpenFiltro,
        filtros, handleFiltrar
    }
}