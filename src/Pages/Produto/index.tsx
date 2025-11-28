import { Box, Button } from "@mui/material"
import { Add } from "@mui/icons-material"
import { FormProduto } from "./FormProduto";
import { useProduto } from "./useProduto";
import { PersonalizedDataGrid } from "../../Components";

export const Produto = () => {
    const {
        produtos,
        isLoading,
        listAllProducts,
        columns,

        pagination, setPagination,

        isFormOpen,
        setIsFormOpen,

        editingProduct,

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

            <PersonalizedDataGrid
                columns={columns}
                rows={produtos.dados}
                loading={isLoading}
                totalRegistros={produtos.totalRegistros}

                paginationModel={{
                    page: pagination.pagina - 1,
                    pageSize: pagination.tamanhoPagina
                }}
                onPaginationModelChange={(model) => {
                    setPagination({
                        pagina: model.page + 1,
                        tamanhoPagina: model.pageSize
                    })
                }}
            />

            <FormProduto
                open={isFormOpen}
                onClose={handleCloseForm}
                editingProduct={editingProduct}
                refreshTable={() => listAllProducts(pagination)}
            />
        </Box>
    )
}