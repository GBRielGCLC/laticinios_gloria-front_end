import { Box, Button, Typography, useTheme } from "@mui/material"
import { Add } from "@mui/icons-material"
import { FormLote } from "./FormLote";
import { useLote } from "./useLote";
import { PersonalizedDataGrid } from "../../Components";

export const Lote = () => {
    const {
        listAllLotes,
        lotes,
        isLoadingLote,
        columns,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleEditProduct,
        handleCloseForm,
    } = useLote();

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
                    Adicionar Lote
                </Button>
            </Box>

            <PersonalizedDataGrid
                rows={lotes.dados}
                columns={columns}
                loading={isLoadingLote}
                onRefresh={listAllLotes}
            />

            <FormLote
                open={isFormOpen}
                onClose={handleCloseForm}
                editingProduct={editingProduct}
                refreshTable={listAllLotes}
            />
        </Box>
    )
}