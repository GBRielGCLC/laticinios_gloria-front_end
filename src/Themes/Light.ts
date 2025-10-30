import { createTheme } from '@mui/material';

export const LightTheme = createTheme({
    palette: {
        primary: {
            main: '#2d4a34',
            light: '#3d5a44',
            dark: '#1f3326',
            contrastText: '#e6d5bc',
        },
        secondary: {
            main: '#e5b55d',
            light: '#eac680',
            dark: '#d4a04c',
            contrastText: '#1f3326',
        },
        background: {
            default: '#f5f3ed',
            paper: '#ffffff',
        },
        text: {
            primary: '#1f3326',
            secondary: '#5a6b5d',
        },
    },
    typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1rem',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
});