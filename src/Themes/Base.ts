// BaseTheme.ts
import { ThemeOptions } from '@mui/material';

export const getBaseTheme = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
    },

    typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        h1: { fontSize: '2rem', fontWeight: 500 },
        h2: { fontSize: '1.5rem', fontWeight: 500 },
        h3: { fontSize: '1.25rem', fontWeight: 500 },
        h4: { fontSize: '1rem', fontWeight: 500 },
    },

    shape: { borderRadius: 10 },

    components: {
        MuiFormLabel: {
            styleOverrides: {
                asterisk: {
                    color: '#d32f2f',
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
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                },
            },
        },

        // A partir daqui não tem na tipagem original do mui
        //@ts-expect-error
        MuiDatePicker: {
            defaultProps: {
                views: ['year', 'month', 'day'],
                slotProps: {
                    actionBar: {
                        actions: ['today', 'clear'],
                    },
                },
            },
        },
    },
});
