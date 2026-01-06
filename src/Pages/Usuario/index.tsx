import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
// import { FormUsuario } from "./FormUsuario";
import { useUsuario } from "./useUsuario";
import { PersonalizedDataGrid } from "../../Components";
import { FormUsuario } from "./Form";
// import { FiltroUsuario } from "./Filtro";

export const Usuario = () => {
    const {
        listAllUsuarios,
        usuarios,
        isLoadingUsuario,
        columns,

        pagination,
        handlePageChange,

        isFormOpen,
        setIsFormOpen,
        editingUser,
        handleCloseForm,

        openFiltro,
        setOpenFiltro,
        filtros,
        handleFiltrar
    } = useUsuario();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                }}
            >
                <Box />

                <Box display="flex" flexDirection="row" gap={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setIsFormOpen(true)}
                    >
                        Adicionar Usuário
                    </Button>
                </Box>
            </Box>

            <PersonalizedDataGrid
                rows={usuarios.dados}
                columns={columns}
                loading={isLoadingUsuario}
                rowCount={usuarios.totalRegistros}
                paginationModel={{
                    page: pagination.pagina - 1,
                    pageSize: pagination.tamanhoPagina
                }}
                onPaginationModelChange={handlePageChange}
                onClickFilter={() => setOpenFiltro(true)}
                onRefresh={() =>
                    listAllUsuarios({ pagination, filtros })
                }
            />

            <FormUsuario
                open={isFormOpen}
                onClose={handleCloseForm}
                editingUser={editingUser}
                refreshTable={() =>
                    listAllUsuarios({ pagination, filtros })
                }
            />

            {/*
            <FiltroUsuario
                open={openFiltro}
                onClose={() => setOpenFiltro(false)}
                onFiltrar={handleFiltrar}
            />
            */}
        </Box>
    );
};
