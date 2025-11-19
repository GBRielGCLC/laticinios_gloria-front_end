import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { ILote } from "../../../Services/Api/Lote";

import { useFormLote } from "./useFormLote";

interface FormLoteProps {
  open: boolean;
  onClose: () => void;
  editingProduct?: ILote | null;
  refreshTable?: () => void;
}

export function FormLote(props: FormLoteProps) {
  const {
    control,
    register,
    errors,
    isEditing,
    handleSubmit,

    isLoading,
  } = useFormLote(props);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Editar Lote" : "Adicionar Novo Lote"}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {/* <TextField
            label="Nome do Lote"
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
          /> */}
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
            {isEditing ? "Atualizar Lote" : "Adicionar Lote"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}