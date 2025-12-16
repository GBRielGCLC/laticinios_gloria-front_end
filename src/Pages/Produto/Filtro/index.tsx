import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
    IconButton
} from "@mui/material";
import { useFiltroProduto } from "./useFiltroProduto";
import { Controller } from "react-hook-form";
import { Close } from "@mui/icons-material";

interface FiltroProdutoProps {
    open: boolean;
    onClose: () => void;
    onFiltrar: (filtros: any) => void;
}

export function FiltroProduto({ open, onClose, onFiltrar }: FiltroProdutoProps) {

    const {
        control,
        errors,
        reset,
        handleSubmit,
    } = useFiltroProduto(onFiltrar);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Filtrar Produtos

                <IconButton
                    onClick={onClose}
                    sx={{ ml: 'auto' }}
                    aria-label="Fechar"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    {/* Valor */}
                    <Controller
                        name="valor"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nome/Descrição do Produto"
                                fullWidth
                                error={!!errors.valor}
                                helperText={errors.valor?.message}
                            />
                        )}
                    />

                    {/* Ativo */}
                    <Controller
                        name="ativo"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                }
                                label={field.value ? "Produtos Ativos" : "Produtos Inativos"}
                            />
                        )}
                    />

                </DialogContent>

                <DialogActions>
                    <Button color="inherit" onClick={() => reset()}>
                        Limpar
                    </Button>

                    <Button type="submit" variant="contained">
                        Aplicar Filtro
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
