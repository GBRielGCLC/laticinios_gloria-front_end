import { useCallback, useEffect, useState } from "react";
import { IFiltroProduto, IListarProdutosProps, IProduto, IProdutoGET, ProdutoService } from "../../Services/Api/Produto";
import { toast } from "react-toastify";
import { GridColDef, GridPaginationModel, GridRenderCellParams } from "@mui/x-data-grid";
import { ActionButtons } from "../../Components";
import { useConfirm } from "../../Contexts";
import { defaultPaginationsData } from "../../Services/Api/Utils";
import { Formatters } from "../../Services/Utils/Formatters";

export const useProduto = () => {
    const [produtos, setProdutos] = useState<IProdutoGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const [pagination, setPagination] = useState(defaultPaginationsData);

    const listAllProducts = useCallback((query: IListarProdutosProps) => {
        setIsLoading(true);

        ProdutoService.listarProdutos(query).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                setProdutos({ dados: [], totalPaginas: 0, totalRegistros: 0 });

                toast.error(result.message);
                return;
            }

            setProdutos(result);
        });
    }, []);

    useEffect(() => {
        listAllProducts({ pagination, filtros });
    }, []);

    const confirmDialog = useConfirm();

    const columns: GridColDef<IProduto>[] = [
        {
            field: 'nome',
            headerName: 'Produto',
            align: 'center',
            headerAlign: 'center',
            flex: 2,
        },
        {
            field: 'descricao',
            headerName: 'Descricão',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'precoUnitario',
            headerName: 'Preço Unitário',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            valueFormatter: (value: number) => Formatters.formatadorMonetario(value),
        },
        {
            field: 'actions',
            headerName: 'Ações',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => ActionButtons({
                params: params,
                onEdit: handleEditProduct,
                onDelete: () => confirmDialog({
                    titulo: 'Excluir produto',
                    conteudo: 'Tem certeza que deseja excluir o produto?',
                    onConfirm: ({ close, setLoading }) => handleDeleteProduto({
                        id: params.row.id,
                        setLoading,
                        close
                    }),
                })
            })
        },
    ];

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduto | null>(null);

    const handleEditProduct = (produto: IProduto) => {
        setEditingProduct(produto);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    interface HandleDeleteProdutoProps {
        id: any;
        setLoading: (v: boolean) => void
        close: () => void;
    }
    const handleDeleteProduto = (props: HandleDeleteProdutoProps) => {
        props.setLoading(true);

        ProdutoService.excluirProduto(props.id).then((result) => {
            props.setLoading(false);

            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            toast.success("Produto excluido com sucesso!");
            listAllProducts({ pagination, filtros });
            props.close();
        })
    };

    const handlePageChange = (model: GridPaginationModel) => {
        const modelPagination = {
            pagina: model.page + 1,
            tamanhoPagina: model.pageSize
        }

        setPagination(modelPagination);
        listAllProducts({ pagination: modelPagination, filtros });
    };

    const [openFiltro, setOpenFiltro] = useState(false);
    const [filtros, setFiltros] = useState<IFiltroProduto>({ ativo: true });

    const handleFiltrar = (filter: IFiltroProduto) => {
        setFiltros(filter);
        listAllProducts({ filtros: filter, pagination });
        setOpenFiltro(false);
    }

    return {
        produtos,
        isLoading,
        listAllProducts,
        columns,

        pagination, handlePageChange,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,

        openFiltro, setOpenFiltro,
        filtros, handleFiltrar
    }
}