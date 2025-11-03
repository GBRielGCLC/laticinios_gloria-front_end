import { Box, Button, Typography } from "@mui/material"
import { InventoryTable, Product, ProductForm } from "../../Components"
import { Add } from "@mui/icons-material"
import { useState } from "react";

interface IEstoque {
    produtos: Product[];
    setProdutos: (produtos: Product[]) => void
}
export const Estoque = ({ produtos, setProdutos }: IEstoque) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleAddProduct = (productData: Omit<Product, "id"> | Product) => {
        if ("id" in productData) {
            setProdutos(produtos.map(p => p.id === productData.id ? productData : p));
        } else {
            const newProduct: Product = {
                ...productData,
                id: Date.now().toString(),
            };
            setProdutos([...produtos, newProduct]);
        }
        setEditingProduct(null);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            setProdutos(produtos.filter(p => p.id !== id));
        }
    };

    const handleDiscard = (id: string) => {
        setProdutos(produtos.filter(p => p.id !== id));
    };

    const handleApplyDiscount = (id: string, discount: number) => {
        setProdutos(produtos.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    discount: discount,
                };
            }
            return product;
        }));
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5">Controle de Estoque</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gerencie produtos, preços, margens de lucro e validades
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setIsFormOpen(true)}
                >
                    Adicionar Produto
                </Button>
            </Box>

            <InventoryTable
                products={produtos}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onDiscard={handleDiscard}
                onApplyDiscount={handleApplyDiscount}
            />

            <ProductForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleAddProduct}
                editingProduct={editingProduct}
            />
        </Box>
    )
}