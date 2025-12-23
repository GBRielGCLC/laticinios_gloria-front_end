import { createTheme } from '@mui/material';
import { getBaseTheme } from './Base';

export const DarkTheme = createTheme(getBaseTheme('dark'),{
    mode: 'dark',
    palette: {
        mode: 'dark',
        primary: {
            main: '#386843ff',
            light: '#519160ff',
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
            default: '#100f09',
            paper: '#1b1e1b',
        },
        text: {
            primary: '#f5f3ed',
            secondary: '#cfc8b8',
        },
        divider: '#2f3330',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#2d4a34',
                    color: '#e6d5bc',
                },
            },
        },
        // A partir daqui não tem na tipagem original do mui
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1c1c1c',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0px 4px 6px rgba(255, 255, 255, 0.06)',
                    borderRadius: 8,
                },
                columnHeader: {
                    background: '#1f3326',
                    color: '#ffffff',
                    fontWeight: 'bold',
                },
                row: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#222222',
                    },
                    '&:nth-of-type(even)': {
                        backgroundColor: '#1c1c1c',
                    },
                    '&:hover': {
                        backgroundColor: '#333333',
                    },
                },
            },
        },
    },
});