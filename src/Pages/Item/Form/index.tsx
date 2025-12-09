import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { IItem } from "../../../Services/Api/Item";
import { useFormItem } from "./useFormItem";
import { Controller } from "react-hook-form";
import { UnidadeMedidaService } from "../../../Services";
import { IProduto } from "../../../Services/Api/Produto";
import { ILote } from "../../../Services/Api/Lote";

interface FormItemProps {
  open: boolean;
  onClose: () => void;
  editingItem?: IItem | null;
  refreshTable?: () => void;
  produtos?: IProduto[];
  lotes?: ILote[];
}

export function FormItem(props: FormItemProps) {
  const {
    control,
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

          <Controller
            name="produtoId"
            control={control}
            render={({ field, fieldState: { error } }) => (

              <Autocomplete
                options={props.produtos ?? []}

                getOptionLabel={(option) => option.nome}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.nome}
                  </li>
                )}

                loading={isLoading}
                noOptionsText="Nenhum produto encontrado"

                value={props.produtos?.find((p) => p.id === field.value) ?? null}
                onChange={(_, newValue) => {
                  field.onChange(newValue ? newValue.id : null);
                }}

                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Produto"
                    required
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

            )}
          />

          <Controller
            name="loteId"
            control={control}
            render={({ field, fieldState: { error } }) => (

              <Autocomplete
                options={props.lotes ?? []}

                getOptionLabel={(option) => option.numeroLote}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.numeroLote}
                  </li>
                )}

                loading={isLoading}
                noOptionsText="Nenhum lote encontrado"

                value={props.lotes?.find((l) => l.id === field.value) ?? null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : null)}

                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lote"
                    required
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

            )}
          />

          <Controller
            name="unidadeMedida"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                select
                label="Unidade de Medida"
                fullWidth
                required
                error={!!error}
                helperText={error?.message}
                disabled={isLoading}
              >
                <MenuItem value={''}>
                  <em>Selecione uma unidade de medida</em>
                </MenuItem>

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