import { useState } from "react";
import {
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { IProduto } from "../../Services/Api/Produto";

interface VendaProps {
    products: IProduto[];
    onSale?: (productId: string, quantity: number) => void;
}

export function Venda({ products, onSale }: VendaProps) {
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [saleQuantity, setSaleQuantity] = useState("");

    return (
        <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', maxWidth: 500 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ShoppingCart color="primary" />
                    <Box>
                        <Typography variant="h6">Registrar Venda</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Selecione um produto e informe a quantidade vendida
                        </Typography>
                    </Box>
                </Box>

                <form /* onSubmit={handleSale} */>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* <FormControl fullWidth>
                            <InputLabel id="product-label">Produto</InputLabel>
                            <Select
                                labelId="product-label"
                                id="product"
                                value={selectedProductId}
                                label="Produto"
                                onChange={(e) => setSelectedProductId(e.target.value)}
                            >
                                {availableProducts.length === 0 ? (
                                    <MenuItem value="" disabled>Nenhum produto disponível</MenuItem>
                                ) : (
                                    availableProducts.map((product) => {
                                        const finalPrice = getFinalPrice(product);
                                        return (
                                            <MenuItem key={product.id} value={product.id}>
                                                {product.nome} - R$ {product.precoUnitario.toFixed(2)} {/* ({product.quantity} disponíveis)
                                                {/* product.discount > 0 && ` - ${product.discount}% OFF` 
                                            </MenuItem>
                                        );
                                    })
                                )}
                            </Select>
                        </FormControl> */}

                        {/* selectedProduct && (
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="body2">Disponível: {selectedProduct.quantity} unidades</Typography>
                                {selectedProduct.discount > 0 ? (
                                    <Box>
                                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                            Preço: R$ {selectedProduct.salePrice.toFixed(2)} por unidade
                                        </Typography>
                                        <Typography variant="body2">
                                            Preço com desconto: R$ {getFinalPrice(selectedProduct).toFixed(2)} por unidade
                                        </Typography>
                                        <Typography variant="body2" color="primary">Desconto: {selectedProduct.discount}%</Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2">Preço: R$ {selectedProduct.salePrice.toFixed(2)} por unidade</Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    Validade: {dayjs(selectedProduct.expiryDate).locale('pt-br').format('DD/MM/YYYY')}
                                </Typography>
                            </Paper>
                        ) */}

                        <TextField
                            label="Quantidade"
                            type="number"
                            // inputProps={{ min: 1, max: selectedProduct?.quantity || 1 }}
                            value={saleQuantity}
                            onChange={(e) => setSaleQuantity(e.target.value)}
                            placeholder="Digite a quantidade"
                            disabled={!selectedProductId}
                            fullWidth
                        />

                        {/* selectedProduct && saleQuantity && parseInt(saleQuantity) > 0 && (
                            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                <Typography variant="body2">
                                    Total: R$ {(parseInt(saleQuantity) * getFinalPrice(selectedProduct)).toFixed(2)}
                                </Typography>
                                <Typography variant="caption">
                                    Lucro estimado: R$ {(parseInt(saleQuantity) * (getFinalPrice(selectedProduct) - selectedProduct.costPrice)).toFixed(2)}
                                </Typography>
                            </Paper>
                        ) */}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={!selectedProductId || !saleQuantity}
                        >
                            Registrar Venda
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
}
