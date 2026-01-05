import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import { DarkMode, EmailOutlined, LightMode, LockOutline, Storefront, Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { useLogin } from "./useLogin";
import { useAppThemeContext } from "../../Contexts";

export const Login = () => {
    const {
        control,
        handleSubmit,
        onSubmit,
        errors,
        isLoading,

        showPassword,
        setShowPassword
    } = useLogin();

    const { toggleTheme, themeName } = useAppThemeContext();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
            }}
        >
            <IconButton
                onClick={toggleTheme}
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "background.paper",
                    boxShadow: 1
                }}
            >
                {themeName === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>

            <Card sx={{ width: 380 }}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 3
                        }}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: "secondary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1
                            }}
                        >
                            <Storefront sx={{ color: "secondary.contrastText" }} />
                        </Box>

                        <Typography variant="h6">
                            Laticínios Glória
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Sistema de Gerenciamento de Estoque
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: "Informe o e-mail" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="E-mail"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    disabled={isLoading}

                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined />
                                                </InputAdornment>
                                            )
                                        }
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="senha"
                            control={control}
                            rules={{ required: "Informe a senha" }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Senha"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.senha}
                                    helperText={errors.senha?.message}
                                    disabled={isLoading}

                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutline />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                />
                            )}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={isLoading}
                            endIcon={isLoading ? <CircularProgress color="inherit" size={20} /> : undefined}
                        >
                            Entrar
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};