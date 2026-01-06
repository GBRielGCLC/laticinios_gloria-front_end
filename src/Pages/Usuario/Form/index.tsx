import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    IconButton,
    MenuItem,
    Switch,
    FormControlLabel,
    Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Controller } from "react-hook-form";

import { IUsuario } from "../../../Services/Api/Usuario";
import { useFormUsuario } from "./useFormUsuario";
import { FuncaoUsuarioService } from "../../../Services/Utils/FuncaoUsuario";

interface FormUsuarioProps {
    open: boolean;
    onClose: () => void;
    editingUser?: IUsuario | null;
    refreshTable?: () => void;
}

export function FormUsuario(props: FormUsuarioProps) {
    const {
        control,
        register,
        errors,
        isEditing,
        handleSubmit,
        isLoading,
    } = useFormUsuario(props);

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}

                <IconButton
                    onClick={props.onClose}
                    sx={{ ml: "auto" }}
                    aria-label="Fechar"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit} noValidate>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nome"
                                fullWidth
                                required
                                {...register("nome")}
                                error={!!errors.nome}
                                helperText={errors.nome?.message}
                                disabled={isLoading}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="E-mail"
                                fullWidth
                                required
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isLoading}
                            />
                        </Grid>
                    </Grid>

                    {!isEditing && (<TextField select {...register("funcao")}>
                        {FuncaoUsuarioService.dados.map(funcao => (
                            <MenuItem key={funcao.id} value={funcao.id}>
                                {funcao.nome}
                            </MenuItem>
                        ))}
                    </TextField>)}

                    {!isEditing && (
                        <TextField
                            label="Senha"
                            type="password"
                            fullWidth
                            required
                            {...register("senha")}
                            error={!!errors.senha}
                            helperText={errors.senha?.message}
                            disabled={isLoading}
                        />
                    )}

                    <Controller
                        name="ativo"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                }
                                label="Usuário ativo"
                            />
                        )}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={props.onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={isLoading && <CircularProgress size={20} />}
                        disabled={isLoading}
                    >
                        {isEditing ? "Atualizar Usuário" : "Adicionar Usuário"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
