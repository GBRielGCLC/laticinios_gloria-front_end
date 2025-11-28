import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { useFiltroLote } from "./useFiltroLote";
import { IFiltroLote } from "../../../Services/Api/Lote";

interface FiltroLoteProps {
  open: boolean;
  onClose: () => void;
  onFiltrar: (filtros: IFiltroLote) => void;
}

export function FiltroLote({ open, onClose, onFiltrar }: FiltroLoteProps) {

  const {
    control,
    register,
    errors,
    reset,
    handleSubmit,
  } = useFiltroLote(onFiltrar);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filtrar Lotes</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          <TextField
            label="Número do Lote"
            fullWidth
            {...register("numeroLote")}
            error={!!errors.numeroLote}
            helperText={errors.numeroLote?.message}
          />

          <Stack direction="row" spacing={2}>
            <Controller
              name="dataCompra"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Data Compra"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
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
                  label="Data Validade"
                  value={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dataValidade,
                      helperText: errors.dataValidade?.message
                    }
                  }}
                />
              )}
            />
          </Stack>

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
    </Dialog >
  );
}