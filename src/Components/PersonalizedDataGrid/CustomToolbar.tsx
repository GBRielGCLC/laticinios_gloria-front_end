// PersonalizedDataGrid/CustomToolbar.tsx (Refatorado)

import React from 'react';
import {
    GridToolbarContainer,
    GridToolbarQuickFilter,
    ToolbarButton,
    GridToolbarProps,
    // Assumimos que estes são imports dos painéis/triggers
    ColumnsPanelTrigger,
    FilterPanelTrigger,
    GridToolbarExport,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';

import {
    Tooltip,
    Badge,
    Divider,
    Box,
    CircularProgress,
    IconButton // Se ToolbarButton não for um IconButton
} from '@mui/material';

// Assumimos que estes ícones estão importados corretamente
import ViewColumn from '@mui/icons-material/ViewColumn';
import FilterList from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import FileDownloadIcon from '@mui/icons-material/FileDownload';


// Interface para injetar as props de controle
interface CustomToolbarProps extends GridToolbarProps {
    onRefresh: () => void;
    isLoading: boolean;
}


export const CustomToolbar = ({ onRefresh, isLoading, ...props }: CustomToolbarProps) => {

    // Propriedades comuns para botões baseados em ToolbarButton/IconButton
    const iconButtonProps = { size: 'small' as const, color: 'default' as const };

    return (
        <GridToolbarContainer
            sx={{
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider'
            }}
        >
            {/* ⬅️ BLOCO DE CONTROLES (Esquerda): Colunas, Filtros, Densidade, Exportar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {/* 1. Colunas */}
                <ColumnsPanelTrigger render={<ToolbarButton {...iconButtonProps} />}>
                    <ViewColumn fontSize="small" />
                </ColumnsPanelTrigger>

                {/* 2. Filtros */}
                <FilterPanelTrigger
                    render={(triggerProps, state) => (
                        <ToolbarButton {...triggerProps} {...iconButtonProps}>
                            <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                <FilterList fontSize="small" />
                            </Badge>
                        </ToolbarButton>
                    )}
                />

                {/* 3. Densidade (Se você for usar este controle) */}
                <GridToolbarDensitySelector />

                {/* 4. Exportar (Usamos o componente padrão do MUI que aceita as props de estilo) */}
                <GridToolbarExport/>
            </Box>

            {/* ➡️ BLOCO DE AÇÕES (Direita): Busca Rápida e Refresh */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                {/* 5. Busca Rápida (Quick Filter) */}
                <GridToolbarQuickFilter />

                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

                {/* 6. Botão de Refresh */}
                <Tooltip title="Atualizar Dados">
                    <span style={{
                        display: 'flex',
                    }}>
                        <IconButton
                            color="inherit"
                            onClick={onRefresh}
                            disabled={isLoading}
                            size="medium"
                        >
                            {isLoading
                                ? <CircularProgress size={20} color="inherit" />
                                : <RefreshIcon fontSize="small" />
                            }
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </GridToolbarContainer>
    );
};