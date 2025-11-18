import { useState } from "react";
import { IProduto, ProdutoService } from "../../Services/Api/Produto";

export const useProduto = () => {
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

    /* const handleAddProduct = (productData: Omit<IProduto, "id"> | IProduto) => {
        if ("id" in productData) {
            setProdutos(produtosHome.map(p => p.id === productData.id ? productData : p));
        } else {
            const newProduct: IProduto = {
                ...productData,
                id: Date.now().toString(),
            };
            setProdutos([...produtos, newProduct]);
        }
        setEditingProduct(null);
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            setProdutos(produtosHome.filter(p => p.id !== id));
        }
    };

    const handleDiscard = (id: string) => {
        setProdutos(produtosHome.filter(p => p.id !== id));
    };

    const handleApplyDiscount = (id: string, discount: number) => {
        setProdutos(produtosHome.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    discount: discount,
                };
            }
            return product;
        }));
    }; */

    return {
        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,
    }
}