import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
} from '@mui/material';
import { Edit, Delete, Warning, Percent } from '@mui/icons-material';
import { useState } from "react";
import { toast } from 'react-toastify';
import { Product } from '../ProductForm';
import dayjs, { Dayjs } from 'dayjs';

interface InventoryTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onDiscard: (id: string) => void;
    onApplyDiscount: (id: string, discount: number) => void;
}

export function InventoryTable({ products, onEdit, onDelete, onDiscard, onApplyDiscount }: InventoryTableProps) {
    const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [discountValue, setDiscountValue] = useState("");

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: "Sem Estoque", color: "error" as const };
        if (quantity < 10) return { label: "Estoque Baixo", color: "warning" as const };
        return { label: "Em Estoque", color: "success" as const };
    };

    const getExpiryStatus = (expiryDate: Dayjs | null) => {
        if (!expiryDate) {
            // No expiry date provided: treat as "no expiry" and use a large positive days value
            return { label: "Sem Validade", color: "default" as const, days: Number.POSITIVE_INFINITY };
        }

        const today = dayjs();
        const expiry = expiryDate;
        const daysUntilExpiry = expiry.diff(today, 'day');

        if (daysUntilExpiry < 0) {
            return { label: "Vencido", color: "error" as const, days: daysUntilExpiry };
        } else if (daysUntilExpiry <= 7) {
            return { label: "Vence em breve", color: "warning" as const, days: daysUntilExpiry };
        } else if (daysUntilExpiry <= 30) {
            return { label: "Próximo do vencimento", color: "default" as const, days: daysUntilExpiry };
        }
        return { label: "Válido", color: "success" as const, days: daysUntilExpiry };
    };

    const getSoldQuantity = (product: Product) => {
        return product.initialQuantity - product.quantity;
    };

    const getFinalPrice = (product: Product) => {
        if (product.discount > 0) {
            return product.salePrice - (product.salePrice * product.discount / 100);
        }
        return product.salePrice;
    };

    const handleDiscountClick = (product: Product) => {
        setSelectedProduct(product);
        setDiscountValue(product.discount.toString());
        setDiscountDialogOpen(true);
    };

    const handleApplyDiscount = () => {
        if (selectedProduct) {
            const discount = parseFloat(discountValue);
            if (discount < 0 || discount > 100) {
                toast.error("Desconto deve estar entre 0% e 100%");
                return;
            }
            onApplyDiscount(selectedProduct.id, discount);
            toast.success(`Desconto de ${discount}% aplicado em ${selectedProduct.name}`);
            setDiscountDialogOpen(false);
            setSelectedProduct(null);
            setDiscountValue("");
        }
    };

    const handleDiscard = (product: Product) => {
        if (window.confirm(`Tem certeza que deseja descartar ${product.name}?`)) {
            onDiscard(product.id);
            toast.success(`${product.name} foi descartado do estoque`);
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Produto</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Custo</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Lucro</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Preço</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Estoque</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Validade</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>Vendidos</TableCell>
                            <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }} align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => {
                                const stockStatus = getStockStatus(product.quantity);
                                const expiryStatus = getExpiryStatus(product.expiryDate);
                                const finalPrice = getFinalPrice(product);

                                return (
                                    <TableRow key={product.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {product.name}
                                                {product.discount > 0 && (
                                                    <Chip label={`-${product.discount}%`} size="small" color="secondary" />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>R$ {product.costPrice.toFixed(2)}</TableCell>
                                        <TableCell>{product.profitMargin}%</TableCell>
                                        <TableCell>
                                            {product.discount > 0 ? (
                                                <Box>
                                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary', fontSize: '0.875rem' }}>
                                                        R$ {product.salePrice.toFixed(2)}
                                                    </Typography>
                                                    <Typography>R$ {finalPrice.toFixed(2)}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography>R$ {product.salePrice.toFixed(2)}</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>
                                            <Chip label={stockStatus.label} size="small" color={stockStatus.color} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Chip label={expiryStatus.label} size="small" color={expiryStatus.color} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {dayjs(product.expiryDate).locale('pt-br').format('L')}
                                                </Typography>
                                                {expiryStatus.days >= 0 && expiryStatus.days <= 30 && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {expiryStatus.days} {expiryStatus.days === 1 ? 'dia' : 'dias'}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{getSoldQuantity(product)}</TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                {(expiryStatus.days <= 30 && expiryStatus.days >= 0) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDiscountClick(product)}
                                                        title="Aplicar desconto"
                                                        color="secondary"
                                                    >
                                                        <Percent fontSize="small" />
                                                    </IconButton>
                                                )}
                                                {expiryStatus.days < 0 && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDiscard(product)}
                                                        title="Descartar produto"
                                                        color="error"
                                                    >
                                                        <Warning fontSize="small" />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onEdit(product)}
                                                    color="primary"
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onDelete(product.id)}
                                                    color="error"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={discountDialogOpen} onClose={() => setDiscountDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Aplicar Desconto</DialogTitle>
                <DialogContent>
                    {selectedProduct && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                                <Typography>Produto: {selectedProduct.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Preço original: R$ {selectedProduct.salePrice.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Validade: {dayjs(selectedProduct.expiryDate).locale('pt-br').format('L')}
                                </Typography>
                            </Paper>
                            <TextField
                                label="Desconto (%)"
                                type="number"
                                inputProps={{ min: 0, max: 100, step: 1 }}
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                placeholder="ex: 20"
                                fullWidth
                            />
                            {discountValue && parseFloat(discountValue) > 0 && (
                                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                    <Typography>
                                        Preço com desconto: R$ {(selectedProduct.salePrice - (selectedProduct.salePrice * parseFloat(discountValue) / 100)).toFixed(2)}
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDiscountDialogOpen(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={handleApplyDiscount} variant="contained" color="primary">
                        Aplicar Desconto
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
