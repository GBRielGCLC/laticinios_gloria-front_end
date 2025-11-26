import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { ILote } from "../../../Services/Api/Lote";

import { useFormLote } from "./useFormLote";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { InputMonetario } from "../../../Components";

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
          <TextField
            label="Numero do Lote"
            fullWidth
            required
            {...register("numeroLote")}
            error={!!errors.numeroLote}
            helperText={errors.numeroLote?.message}
            disabled={isLoading}
          />

          <TextField
            label="Quantidade"
            fullWidth
            required
            {...register("quantidade")}
            error={!!errors.quantidade}
            helperText={errors.quantidade?.message}
            disabled={isLoading}
          />

          <Controller
            name="valorLoteCompra"
            control={control}
            render={({ field }) => (
              <InputMonetario
                {...field}
                label="Preço Unitário"
                fullWidth
                required
                error={!!errors.valorLoteCompra}
                helperText={errors.valorLoteCompra?.message}
                disabled={isLoading}
              />
            )}
          />

          <Stack direction="row" spacing={2}>
            <Controller
              name="dataCompra"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label={"Data da Compra"}
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.dataCompra,
                      helperText: errors.dataCompra?.message
                    }
                  }}
                />
              )}
            />

            <Controller
              name="dataValidade"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label={"Data de Validade"}
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.dataValidade,
                      helperText: errors.dataValidade?.message
                    }
                  }}
                />
              )}
            />
          </Stack>
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