import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Stack,
  MenuItem,
} from "@mui/material";
import { IItem } from "../../../Services/Api/Item";
import { useFormItem } from "./useFormItem";
import { Controller } from "react-hook-form";
import { UnidadeMedidaService } from "../../../Services";

interface FormItemProps {
  open: boolean;
  onClose: () => void;
  editingItem?: IItem | null;
  refreshTable?: () => void;
}

export function FormItem(props: FormItemProps) {
  const {
    control,
    register,
    errors,
    isEditing,
    handleSubmit,

    isLoading,
  } = useFormItem(props);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Editar Item de Lote" : "Adicionar Novo Item de Lote"}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            label="ID do Produto"
            fullWidth
            required
            type="number"
            {...register("produtoId")}
            error={!!errors.produtoId}
            // helperText={errors.produtoId?.message}
            disabled={isLoading || isEditing}
          />

          <TextField
            label="ID do Lote"
            fullWidth
            required
            type="number"
            {...register("loteId")}
            error={!!errors.loteId}
            // helperText={errors.loteId?.message}
            disabled={isLoading || isEditing}
          />

          <Controller
            name="unidadeMedida"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Unidade de Medida"
                fullWidth
                required
                error={!!errors.unidadeMedida}
                helperText={errors.unidadeMedida?.message}
                disabled={isLoading}
              >
                {UnidadeMedidaService.dados.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nome + (option.sigla ? ` (${option.sigla})` : '')}
                  </MenuItem>
                ))}
              </TextField>
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
            {isEditing ? "Atualizar Item" : "Adicionar Item"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}