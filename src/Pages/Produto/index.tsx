import { Box, Button, Typography, useTheme } from "@mui/material"
import { Add } from "@mui/icons-material"
import { InventoryTable } from "./Tabela";
import { FormProduto } from "./FormProduto";
import { IProduto } from "../../Services/Api/Produto";
import { useProduto } from "./useProduto";

export const Produto = () => {
    const {
        produtos,
        isLoading,
        listAllProducts,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,
    } = useProduto();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box></Box>

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
                products={produtos.dados}
                onClickEdit={handleEditProduct}
                refreshTable={listAllProducts}
            />

            <FormProduto
                open={isFormOpen}
                onClose={handleCloseForm}
                editingProduct={editingProduct}
                refreshTable={listAllProducts}
            />
        </Box>
    )
}