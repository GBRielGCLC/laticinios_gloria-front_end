import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export interface Product {
  id: string;
  name: string;
  costPrice: number;
  profitMargin: number;
  salePrice: number;
  quantity: number;
  initialQuantity: number;
  expiryDate: Dayjs | null;
  discount: number;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id"> | Product) => void;
  editingProduct?: Product | null;
}

export function ProductForm({ open, onClose, onSubmit, editingProduct }: ProductFormProps) {
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [profitMargin, setProfitMargin] = useState("30");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCostPrice(editingProduct.costPrice.toString());
      setProfitMargin(editingProduct.profitMargin.toString());
      setQuantity(editingProduct.quantity.toString());
      setExpiryDate(editingProduct.expiryDate);
    } else {
      setName("");
      setCostPrice("");
      setProfitMargin("30");
      setQuantity("");
      setExpiryDate(null);
    }
  }, [editingProduct, open]);

  const calculateSalePrice = () => {
    const cost = parseFloat(costPrice) || 0;
    const margin = parseFloat(profitMargin) || 0;
    return cost + (cost * margin / 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name,
      costPrice: parseFloat(costPrice),
      profitMargin: parseFloat(profitMargin),
      salePrice: calculateSalePrice(),
      quantity: parseInt(quantity),
      initialQuantity: editingProduct ? editingProduct.initialQuantity : parseInt(quantity),
      expiryDate,
      discount: editingProduct ? editingProduct.discount : 0,
    };

    if (editingProduct) {
      onSubmit({ ...productData, id: editingProduct.id });
    } else {
      onSubmit(productData);
    }

    setName("");
    setCostPrice("");
    setProfitMargin("30");
    setQuantity("");
    setExpiryDate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome do Produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Maçã"
            required
            fullWidth
          />

          <TextField
            label="Preço de Custo (R$)"
            type="number"
            inputProps={{ step: 0.01, min: 0 }}
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="0.00"
            required
            fullWidth
          />

          <TextField
            label="Margem de Lucro (%)"
            type="number"
            inputProps={{ step: 0.1, min: 0 }}
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            placeholder="30"
            helperText={
              costPrice && profitMargin
                ? `Preço de venda: R$ ${calculateSalePrice().toFixed(2)}`
                : ''
            }
            required
            fullWidth
          />

          <TextField
            label="Quantidade"
            type="number"
            inputProps={{ min: 0 }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            required
            fullWidth
          />

          <DatePicker
            label="Data de Validade"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e)}
            // InputLabelProps={{ shrink: true }}
            // required
            // fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {editingProduct ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
