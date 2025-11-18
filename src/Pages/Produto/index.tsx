import { Box, Button, Typography, useTheme } from "@mui/material"
import { Add } from "@mui/icons-material"
import { InventoryTable } from "./Tabela";
import { FormProduto } from "./FormProduto";
import { IProduto } from "../../Services/Api/Produto";
import { useProduto } from "./useProduto";

interface IEstoque {
    produtos: IProduto[];
    isLoadingTable?: boolean;
    refreshTable?: () => void
    // setProdutos: (produtos: IProduto[]) => void
}
export const Estoque = ({
    produtos,
    refreshTable
}: IEstoque) => {
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