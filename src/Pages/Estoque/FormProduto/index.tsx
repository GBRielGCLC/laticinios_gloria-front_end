import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import { IProduto } from "../../../Services/Api/Produto";

import { useFormProduto } from "./useFormProduto";

interface FormProdutoProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<IProduto, "id"> | IProduto) => void;
  editingProduct?: IProduto | null;
}

export function FormProduto(props: FormProdutoProps) {
  const {
    control,
    register,
    errors,
    isEditing,
    calculatedSalePrice,
    handleSubmit,
  } = useFormProduto(props);

  const profitMarginHelperText =
    errors.profitMargin?.message ||
    (calculatedSalePrice > 0
      ? `Preço de venda: R$ ${calculatedSalePrice.toFixed(2)}`
      : "");

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            label="Nome do Produto"
            placeholder="ex: Maçã"
            fullWidth
            required
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Preço de Custo (R$)"
            type="number"
            inputProps={{ step: 0.01, min: 0 }}
            placeholder="0.00"
            fullWidth
            required
            {...register("costPrice", { valueAsNumber: true })}
            error={!!errors.costPrice}
            helperText={errors.costPrice?.message}
          />

          <TextField
            label="Margem de Lucro (%)"
            type="number"
            inputProps={{ step: 0.1, min: 0 }}
            placeholder="30"
            fullWidth
            required
            {...register("profitMargin", { valueAsNumber: true })}
            error={!!errors.profitMargin}
            helperText={profitMarginHelperText}
          />

          <TextField
            label="Quantidade"
            type="number"
            inputProps={{ min: 0 }}
            placeholder="0"
            fullWidth
            required
            {...register("quantity", { valueAsNumber: true })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />

          <Controller
            name="expiryDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label="Data de Validade"
                slotProps={{
                  textField: {
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={props.onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}