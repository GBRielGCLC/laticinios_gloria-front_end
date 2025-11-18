import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { IProduto } from "../../../Services/Api/Produto";

import { useFormProduto } from "./useFormProduto";

interface FormProdutoProps {
  open: boolean;
  onClose: () => void;
  editingProduct?: IProduto | null;
  refreshTable?: () => void;
}

export function FormProduto(props: FormProdutoProps) {
  const {
    control,
    register,
    errors,
    isEditing,
    handleSubmit,

    isLoading,
  } = useFormProduto(props);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            label="Nome do Produto"
            fullWidth
            required
            {...register("nome")}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            disabled={isLoading}
          />

          <TextField
            label="Descrição"
            fullWidth
            required
            {...register("descricao")}
            error={!!errors.descricao}
            helperText={errors.descricao?.message}
            disabled={isLoading}
          />

          <TextField
            label="Preço Unitário"
            type="number"
            inputProps={{ step: 0.01, min: 0 }}
            placeholder="0.00"
            fullWidth
            required
            {...register("precoUnitario", { valueAsNumber: true })}
            error={!!errors.precoUnitario}
            helperText={errors.precoUnitario?.message}
            disabled={isLoading}
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
            {isEditing ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}