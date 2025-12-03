import { Box, Button } from "@mui/material"
import { Add } from "@mui/icons-material"
import { FormProduto } from "./FormProduto";
import { useProduto } from "./useProduto";
import { PersonalizedDataGrid } from "../../Components";
import { FiltroProduto } from "./Filtro";

export const Produto = () => {
    const {
        produtos,
        isLoading,
        listAllProducts,
        columns,

        pagination, handlePageChange,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

        handleCloseForm,

        openFiltro, setOpenFiltro,
        filtros, handleFiltrar
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

            <PersonalizedDataGrid
                columns={columns}
                rows={produtos.dados}
                loading={isLoading}
                totalRegistros={produtos.totalRegistros}

                paginationModel={{
                    page: pagination.pagina - 1,
                    pageSize: pagination.tamanhoPagina
                }}
                onPaginationModelChange={handlePageChange}

                onClickFilter={() => setOpenFiltro(true)}
                onRefresh={() => listAllProducts({ pagination, filtros })}
            />

            <FormProduto
                open={isFormOpen}
                onClose={handleCloseForm}
                editingProduct={editingProduct}
                refreshTable={() => listAllProducts({ pagination, filtros })}
            />

            <FiltroProduto
                open={openFiltro}
                onClose={() => setOpenFiltro(false)}
                onFiltrar={handleFiltrar}
            />
        </Box>
    )
}