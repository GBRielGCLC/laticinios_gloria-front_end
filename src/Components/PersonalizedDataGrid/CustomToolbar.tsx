import React from 'react';
import {
    GridToolbarContainer,
    ColumnsPanelTrigger,
    // ExportTrigger,
    ToolbarButton,
} from '@mui/x-data-grid';
import { Box, Divider, keyframes, Tooltip } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import { FilterAlt, ViewColumn } from '@mui/icons-material';

interface CustomToolbarProps {
    isLoading: boolean;
    onRefresh?: () => void;
    onClickFilter?: () => void;
}

export const CustomToolbar = ({ onRefresh, isLoading, onClickFilter }: CustomToolbarProps) => {
    const spin = keyframes`
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    `;

    return (
        <GridToolbarContainer sx={{
            p: 1,
            display: 'flex',
            alignItems: 'end',
        }}>
            <Tooltip title="Colunas">
                <ColumnsPanelTrigger render={<ToolbarButton />}>
                    <ViewColumn fontSize="small" />
                </ColumnsPanelTrigger>
            </Tooltip>

            {/* <Tooltip title="Export PDF">
                <ExportTrigger
                    slotProps={{
                        button: { variant: 'pdf' }, // exporta só PDF
                    }}
                >
                    <ToolbarButton />
                </ExportTrigger>
            </Tooltip> */}

            {(onClickFilter || onRefresh) && <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />}

            {onClickFilter && <Tooltip title="Filtro">
                <ToolbarButton onClick={onClickFilter}>
                    <FilterAlt fontSize="small" />
                </ToolbarButton>
            </Tooltip>}

            {onRefresh && <Tooltip title="Recarregar">
                <span>
                    <ToolbarButton
                        onClick={onRefresh}
                        disabled={isLoading}

                    >
                        <RefreshIcon
                            fontSize="small"
                            sx={{
                                animation: isLoading
                                    ? `${spin} 0.8s linear infinite`
                                    : 'none',
                                transition: 'transform 0.3s ease',
                            }}
                        />
                    </ToolbarButton>
                </span>
            </Tooltip>}
        </GridToolbarContainer>
    );
};
