import { Box, Button, Typography, useTheme } from "@mui/material"
import { Add, FilterAlt } from "@mui/icons-material"
import { FormLote } from "./FormLote";
import { useLote } from "./useLote";
import { PersonalizedDataGrid } from "../../Components";
import { FiltroLote } from "./Filtro";

export const Lote = () => {
    const {
        listAllLotes,
        lotes,
        isLoadingLote,
        columns,

        pagination, handlePageChange,

        isFormOpen,
        setIsFormOpen,
        editingProduct,
        handleCloseForm,

        openFiltro, setOpenFiltro,
        filtros, handleFiltrar
    } = useLote();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box></Box>

                <Box display='flex' flexDirection='row' gap={1}>
                    <Button variant="outlined" onClick={() => setOpenFiltro(true)} endIcon={<FilterAlt />}>
                        Filtrar Lotes
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setIsFormOpen(true)}
                    >
                        Adicionar Lote
                    </Button>
                </Box>
            </Box>

            <PersonalizedDataGrid
                rows={lotes.dados}
                columns={columns}
                loading={isLoadingLote}

                rowCount={lotes.totalRegistros}

                paginationModel={{
                    page: pagination.pagina - 1,
                    pageSize: pagination.tamanhoPagina
                }}
                onPaginationModelChange={handlePageChange}
            />

            <FormLote
                open={isFormOpen}
                onClose={handleCloseForm}
                editingProduct={editingProduct}
                refreshTable={() => listAllLotes({ pagination, filtros })}
            />

            <FiltroLote
                open={openFiltro}
                onClose={() => setOpenFiltro(false)}
                onFiltrar={handleFiltrar}
            />
        </Box>
    )
}