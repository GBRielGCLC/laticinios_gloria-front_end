import {
    DataGrid,
    DataGridProps,
} from '@mui/x-data-grid';
import { ptBR as gridPtBR } from '@mui/x-data-grid/locales';
import { NoResultsCustom, NoRowsCustom } from './CustomOverlays';

const localeText: DataGridProps['localeText'] = {
    ...gridPtBR.components.MuiDataGrid.defaultProps.localeText,
    toolbarQuickFilterLabel: 'Filtro Rápido',
    paginationDisplayedRows: ({ from, to, count }) => `${from} - ${to} de ${count}`,
};

const paginationModel = { page: 1, pageSize: 10 };

export const PersonalizedDataGrid = (props: DataGridProps, title?: string) => {
    return (
        <DataGrid
            localeText={localeText}

            showToolbar
            slots={{
                // toolbar: CustomToolbar
                noRowsOverlay: NoRowsCustom,
                noResultsOverlay: NoResultsCustom,
            }}
            slotProps={{
                toolbar: {
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                },
                filterPanel: {
                    sx: {
                        '& .MuiDataGrid-filterForm': {
                            display: 'flex',
                            alignItems: 'center', // Alinha os selects verticalmente ao centro
                            gap: 2, // Espaçamento horizontal entre os elementos
                            pb: 1,
                        },
                        '& .MuiFormControl-root': {
                            marginTop: 0,
                            marginBottom: 0,
                        },
                    },
                }
            }}
            ignoreDiacritics // Letras com ou sem acentos são consideradas as mesmas

            showCellVerticalBorder
            showColumnVerticalBorder

            autosizeOnMount
            disableRowSelectionOnClick

            initialState={{
                pagination: { paginationModel },
            }}
            pageSizeOptions={[1, 5, 10, 20, 50, 100]}


            getRowHeight={() => 'auto'} // Altura automática das linhas
            sx={{
                '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center', // centraliza verticalmente
                    // justifyContent: 'center', // centraliza horizontalmente, está sendo configurado individualmente nas colunas
                },
            }}

            {...props}
        />
    );
};