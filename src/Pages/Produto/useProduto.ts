import { useCallback, useEffect, useState } from "react";
import { IProduto, IProdutoGET, ProdutoService } from "../../Services/Api/Produto";
import { toast } from "react-toastify";

export const useProduto = () => {
    const [produtos, setProdutos] = useState<IProdutoGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });
    const [isLoading, setIsLoading] = useState(false)

    const listAllProducts = useCallback(() => {
        setIsLoading(true);

        ProdutoService.listarProdutos().then((result) => {
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
        listAllProducts();
    }, []);

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

    return {
        produtos,
        isLoading,
        listAllProducts,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,
    }
}