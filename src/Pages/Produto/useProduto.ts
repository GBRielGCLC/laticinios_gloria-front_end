import { useCallback, useEffect, useState } from "react";
import { IProduto, IProdutoGET, ProdutoService } from "../../Services/Api/Produto";
import { toast } from "react-toastify";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ActionButtons } from "../../Components";
import { useConfirm } from "../../Contexts";
import { defaultPaginationsData, IPagination } from "../../Services/Api/Utils";

export const useProduto = () => {
    const [produtos, setProdutos] = useState<IProdutoGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const [pagination, setPagination] = useState(defaultPaginationsData);

    const listAllProducts = useCallback((pagination?: IPagination) => {
        setIsLoading(true);

        ProdutoService.listarProdutos(pagination).then((result) => {
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
        listAllProducts(pagination);
    }, [listAllProducts, pagination]);

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
            valueFormatter: (value: number) => `R$ ${value.toFixed(2)}`,
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
            listAllProducts(pagination);
            props.close();
        })
    }

    return {
        produtos,
        isLoading,
        listAllProducts,
        columns,

        pagination, setPagination,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,
    }
}