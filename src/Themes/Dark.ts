import { createTheme } from '@mui/material';

export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2d4a34',      // mantém o verde original
            light: '#3d5a44',
            dark: '#1f3326',
            contrastText: '#e6d5bc',
        },
        secondary: {
            main: '#e5b55d',      // mantém o dourado original
            light: '#eac680',
            dark: '#d4a04c',
            contrastText: '#1f3326',
        },
        background: {
            default: '#121412',   // fundo principal escuro neutro
            paper: '#1b1e1b',     // cartões e containers
        },
        text: {
            primary: '#f5f3ed',   // texto principal claro
            secondary: '#cfc8b8', // texto secundário levemente amarelado
        },
        divider: '#2f3330',
        error: {
            main: '#ef4444',
        },
        warning: {
            main: '#f59e0b',
        },
        success: {
            main: '#4ade80',
        },
        info: {
            main: '#60a5fa',
        },
    },
    typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        h1: { fontSize: '2rem', fontWeight: 500 },
        h2: { fontSize: '1.5rem', fontWeight: 500 },
        h3: { fontSize: '1.25rem', fontWeight: 500 },
        h4: { fontSize: '1rem', fontWeight: 500 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2d4a34', // mantém a cor do tema claro
                    color: '#e6d5bc',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 10,
                },
                containedPrimary: {
                    backgroundColor: '#2d4a34',
                    color: '#e6d5bc',
                    '&:hover': {
                        backgroundColor: '#3d5a44',
                    },
                },
                containedSecondary: {
                    backgroundColor: '#e5b55d',
                    color: '#1f3326',
                    '&:hover': {
                        backgroundColor: '#eac680',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1b1e1b',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.6)',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#e5b55d', // dourado no indicador
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    color: '#e6d5bc',
                    '&.Mui-selected': {
                        color: '#e5b55d',
                    },
                },
            },
        },
    },
});