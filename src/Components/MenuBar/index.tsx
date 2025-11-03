import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

import { Storefront, LightMode, DarkMode } from '@mui/icons-material';
import { useAppThemeContext } from "../../Contexts";

export const MenuBar = ({ children }: { children: React.ReactNode }) => {

    const { toggleTheme, themeName } = useAppThemeContext();

    return (
        <Box>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: 'secondary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                        }}
                    >
                        <Storefront sx={{ color: 'secondary.contrastText' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">Laticínios Glória</Typography>
                        <Typography variant="caption" sx={{ color: 'primary.contrastText', opacity: 0.8 }}>
                            Sistema de Gerenciamento de Estoque
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        sx={{ ml: 2 }}
                    >
                        {themeName === 'light' ? <DarkMode /> : <LightMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {children}
        </Box>
    )
}