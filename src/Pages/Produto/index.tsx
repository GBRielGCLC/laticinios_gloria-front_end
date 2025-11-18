import { Box, Button, Typography, useTheme } from "@mui/material"
import { Add } from "@mui/icons-material"
import { useState } from "react";
import { InventoryTable } from "./Tabela";
import { FormProduto } from "./FormProduto";
import { IProduto } from "../../Services/Api/Produto";

interface IEstoque {
    produtos: IProduto[];
    isLoadingTable?: boolean;
    refreshTable?: () => void
    // setProdutos: (produtos: IProduto[]) => void
}
export const Estoque = ({
    produtos,
    isLoadingTable = false,
    refreshTable
}: IEstoque) => {
    const theme = useTheme();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduto | null>(null);

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

    const handleEditProduct = (produto: IProduto) => {
        setEditingProduct(produto);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" color={theme.palette.primary.contrastText}>Controle de Estoque</Typography>
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
                onClickEdit={handleEditProduct}
            />

            <FormProduto
                open={isFormOpen}
                onClose={handleCloseForm}
                editingProduct={editingProduct}
                refreshTable={refreshTable}
            />
        </Box>
    )
}