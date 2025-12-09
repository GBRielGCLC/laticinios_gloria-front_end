// Item.zip/Item/index.tsx

import { Box, Button } from "@mui/material"
import { Add } from "@mui/icons-material"
import { PersonalizedDataGrid } from "../../Components";
import { useItem } from "./useItem";
import { FormItem } from "./Form";

export const Item = () => {
    const {
        listAllItens,
        itens,
        isLoadingItem,
        columns,

        pagination, handlePageChange,

        isFormOpen,
        setIsFormOpen,
        editingItem,
        handleCloseForm,

        openFiltro, setOpenFiltro,
        filtros, handleFiltrar,

        produtos, lotes
    } = useItem();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box></Box>

                <Box display='flex' flexDirection='row' gap={1}>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setIsFormOpen(true)}
                    >
                        Adicionar Item
                    </Button>
                </Box>
            </Box>

            <PersonalizedDataGrid
                rows={itens.dados}
                columns={columns}
                loading={isLoadingItem}

                rowCount={itens.totalRegistros}

                paginationModel={{
                    page: pagination.pagina - 1,
                    pageSize: pagination.tamanhoPagina
                }}
                onPaginationModelChange={handlePageChange}

                // onClickFilter={() => setOpenFiltro(true)}
                onRefresh={() => listAllItens({ pagination, filtros })}
            />

            <FormItem
                open={isFormOpen}
                onClose={handleCloseForm}
                editingItem={editingItem}
                refreshTable={() => listAllItens({ pagination, filtros })}

                produtos={produtos}
                lotes={lotes}
            />

            {/* <FiltroItem
                open={openFiltro}
                onClose={() => setOpenFiltro(false)}
                onFiltrar={handleFiltrar}
            /> */}
        </Box>
    )
}