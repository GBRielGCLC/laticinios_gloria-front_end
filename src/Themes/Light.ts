import { createTheme } from '@mui/material';
import { getBaseTheme } from './Base';

export const LightTheme = createTheme(getBaseTheme('light'), {
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
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
                    borderRadius: 8,
                },
                columnHeader: {
                    background: '#2d4a34',
                    color: '#ffffff',
                    fontWeight: 'bold',
                },
                row: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#ffffff',
                    },
                    '&:nth-of-type(even)': {
                        backgroundColor: '#f5f5f5',
                    },
                    '&:hover': {
                        backgroundColor: '#eaeaea',
                    },
                },
            },
        },
    },
});