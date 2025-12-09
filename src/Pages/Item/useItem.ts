import { useCallback, useEffect, useState } from "react";
import { IFiltroItem, IListarItensProps, IItem, IItemGET, ItemService } from "../../Services/Api/Item";
import { toast } from "react-toastify";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { ActionButtons } from "../../Components/PersonalizedDataGrid/ActionButtons";
import { useConfirm } from "../../Contexts";
import { defaultPaginationsData, IPagination } from "../../Services/Api/Utils";
import { Formatters } from "../../Services/Utils/Formatters";
import { IProduto, ProdutoService } from "../../Services/Api/Produto";
import { ILote, LoteService } from "../../Services/Api/Lote";

const initialFiltros: IFiltroItem = {
    produtoId: undefined,
    loteId: undefined,
    unidadeMedida: undefined,
}

export const useItem = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IItem | null>(null);

    const [isLoadingItem, setIsLoadingItem] = useState(false);

    const [itens, setItens] = useState<IItemGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });

    const [pagination, setPagination] = useState(defaultPaginationsData);

    const confirmDialog = useConfirm();

    const [openFiltro, setOpenFiltro] = useState(false);
    const [filtros, setFiltros] = useState<IFiltroItem>(initialFiltros);

    const handleEditItem = (item: IItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    interface HandleDeleteItemProps {
        id: any;
        setLoading: (v: boolean) => void
        close: () => void;
    }
    const handleDeleteItem = (props: HandleDeleteItemProps) => {
        props.setLoading(true);

        ItemService.excluirItem(props.id).then((result) => {
            props.setLoading(false);

            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            toast.success("Item de Lote excluído com sucesso!");
            listAllItens({ pagination, filtros });
            props.close();
        })
    }

    const columns: GridColDef<IItem>[] = [
        /* {
            field: 'produtoNome',
            headerName: 'Produto',
            flex: 2,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.produto.nome,
        }, */
        /* {
            field: 'numeroLote',
            headerName: 'Nº Lote',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.lote.numeroLote,
        }, */
        {
            field: 'preco',
            headerName: 'Preço (Item)',
            flex: 1,
            type: 'number',
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (value: number | null) => Formatters.formatadorMonetario(value),
        },
        {
            field: 'unidadeMedida',
            headerName: 'Unidade Medida',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        /* {
            field: 'dataValidadeLote',
            headerName: 'Validade (Lote)',
            flex: 1,
            type: 'date',
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.lote.dataValidade,
            valueFormatter: (value: string) => {
                if (!value) return '';

                return dayjs(value).format('DD/MM/YYYY');
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
                onEdit: handleEditItem,
                onDelete: () => {
                    confirmDialog({
                        titulo: 'Excluir Item de Lote',
                        conteudo: 'Tem certeza que deseja excluir este item de lote?',
                        onConfirm: ({ close, setLoading }) => handleDeleteItem({
                            id: params.row.id,
                            setLoading,
                            close
                        })
                    })
                },
            }),
        },
    ];

    const listAllItens = useCallback((query?: IListarItensProps) => {
        setIsLoadingItem(true);

        if (!query) query = {};
        if (!query.pagination) query.pagination = pagination;
        if (!query.filtros) query.filtros = filtros;

        ItemService.listarItens(query).then((result) => {
            setIsLoadingItem(false);

            if (result instanceof Error) {
                setItens({ dados: [], totalPaginas: 0, totalRegistros: 0 });

                toast.error(result.message);
                return;
            }

            setItens(result);
        })
    }, [pagination, filtros]);

    useEffect(() => {
        listAllItens({ pagination, filtros });
    }, [listAllItens]);

    const handlePageChange = (model: GridPaginationModel) => {
        const modelPagination = {
            pagina: model.page + 1,
            tamanhoPagina: model.pageSize
        }

        setPagination(modelPagination);
        listAllItens({ pagination: modelPagination, filtros });
    };


    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingItem(null);
    };

    const handleFiltrar = (filter: IFiltroItem) => {
        const newPagination: IPagination = {
            pagina: 1,
            tamanhoPagina: pagination.tamanhoPagina
        }

        setPagination(newPagination);
        setFiltros(filter);

        listAllItens({ filtros: filter, pagination: newPagination });
        setOpenFiltro(false);
    }

    const [produtos, setProdutos] = useState<IProduto[]>([]);
    const [lotes, setLotes] = useState<ILote[]>([]);

    const getDadosSelects = useCallback(() => {
        ProdutoService.listarProdutos().then((result) => {

            if (result instanceof Error) {
                setProdutos([]);

                toast.error(result.message);
                return;
            }

            setProdutos(result.dados);
        });

        LoteService.listarLotes().then((result) => {

            if (result instanceof Error) {
                setLotes([]);

                toast.error(result.message);
                return;
            }

            setLotes(result.dados);
        })
    }, []);

    useEffect(() => {
        getDadosSelects();
    }, [getDadosSelects]);

    return {
        listAllItens,
        itens,
        isLoadingItem,
        columns,

        pagination, handlePageChange,

        isFormOpen,
        setIsFormOpen,
        editingItem,
        handleCloseForm,

        openFiltro, setOpenFiltro,
        filtros, handleFiltrar,

        produtos, lotes
    }
}