import { Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

export interface ActionButtonsProps<T> extends React.PropsWithChildren {
    params: GridRenderCellParams<any, T>;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export const ActionButtons = <T,>({
    params,
    onEdit,
    onDelete,
    children,
}: ActionButtonsProps<T>) => {
    const row = params.row;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                gap: 1,
            }}
        >
            {onEdit && <Tooltip title="Editar">
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit(row);
                    }}
                    color='primary'
                >
                    <Edit />
                </IconButton>
            </Tooltip>}

            {onDelete && <Tooltip title="Excluir">
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete(row);
                    }}
                    color="error"
                >
                    <Delete />
                </IconButton>
            </Tooltip>}

            {children}
        </Box>
    );
};