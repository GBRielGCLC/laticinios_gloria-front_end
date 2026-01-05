import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Divider
} from "@mui/material";
import {
    Storefront,
    LightMode,
    DarkMode,
    AccountCircle,
    Logout
} from "@mui/icons-material";
import { useState } from "react";
import { useAppThemeContext } from "../../Contexts";
import { useAuth } from "../../Contexts/AuthContext";

export const MenuBar = ({ children }: { children: React.ReactNode }) => {
    const { toggleTheme, themeName } = useAppThemeContext();
    const { user, logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleCloseMenu();
        logout();
    };

    return (
        <Box>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: "secondary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                        }}
                    >
                        <Storefront sx={{ color: "secondary.contrastText" }} />
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                            Laticínios Glória
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "primary.contrastText",
                                opacity: 0.8
                            }}
                        >
                            Sistema de Gerenciamento de Estoque
                        </Typography>
                    </Box>

                    {/* 🌗 Tema */}
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        sx={{ ml: 1 }}
                    >
                        {themeName === "light" ? <DarkMode /> : <LightMode />}
                    </IconButton>

                    {/* 👤 Usuário */}
                    <IconButton
                        color="inherit"
                        onClick={handleOpenMenu}
                        sx={{ ml: 1 }}
                    >
                        <AccountCircle />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2">
                                {user?.nome ?? "Usuário"}
                            </Typography>
                        </Box>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <Logout fontSize="small" sx={{ mr: 1 }} />
                            Sair
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {children}
        </Box>
    );
};
