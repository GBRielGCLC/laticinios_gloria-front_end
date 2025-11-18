import { Box, Button, Typography, useTheme } from "@mui/material"
import { Add } from "@mui/icons-material"
import { InventoryTable } from "./Tabela";
import { FormProduto } from "./FormProduto";
import { IProduto } from "../../Services/Api/Produto";
import { useProduto } from "./useProduto";

interface IProdutoProps {
    produtos: IProduto[];
    isLoadingTable?: boolean;
    refreshTable?: () => void
    // setProdutos: (produtos: IProduto[]) => void
}
export const Produto = ({
    produtos,
    refreshTable
}: IProdutoProps) => {
    const theme = useTheme();
    const {
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
                products={produtos}
                onClickEdit={handleEditProduct}
                refreshTable={refreshTable}
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