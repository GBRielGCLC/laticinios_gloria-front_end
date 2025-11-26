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
import { InputMonetario } from "../../../Components";
import { Controller } from "react-hook-form";

interface FormProdutoProps {
  open: boolean;
  onClose: () => void;
  editingProduct?: IProduto | null;
  refreshTable?: () => void;
}

export function FormProduto(props: FormProdutoProps) {
  const {
    control,
    errors,
    isEditing,
    handleSubmit,

    isLoading,
    reset
  } = useFormProduto(props);

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome do Produto"
                fullWidth
                required
                error={!!errors.nome}
                helperText={errors.nome?.message}
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="descricao"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição"
                fullWidth
                required
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
                disabled={isLoading}
              />
            )}
          />

          <Controller
            name="precoUnitario"
            control={control}
            render={({ field }) => (
              <InputMonetario
                {...field}
                label="Preço Unitário"
                fullWidth
                required
                error={!!errors.precoUnitario}
                helperText={errors.precoUnitario?.message}
                disabled={isLoading}
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
            {isEditing ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}