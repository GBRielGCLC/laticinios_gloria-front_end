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
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import { useFormVenda } from './useVenda';
import { FormaPagamentoService } from '../../Services/Utils/FormaPagamento';

export function Venda() {
    const {
        itens,
        control,
        loading,
        errors,
        selectedItem,
        valorTotal,
        handleSubmit,
    } = useFormVenda();

    return (
        <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', maxWidth: 500 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ShoppingCart color="primary" />
                    <Box>
                        <Typography variant="h6">Registrar Venda</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Selecione o item e a quantidade vendida
                        </Typography>
                    </Box>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                        {/* ITEM */}
                        <Controller
                            name="itemId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Item"
                                    variant="outlined"

                                    error={!!errors.itemId}
                                    helperText={errors.itemId?.message}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione o item
                                    </MenuItem>

                                    {itens.map((i) => (
                                        <MenuItem key={i.id} value={i.id}>
                                            {i.produto.nome} — R$ {i.preco.toFixed(2)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        {/* INFO DO ITEM */}
                        {selectedItem && (
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="body2">
                                    Preço unitário: R$ {selectedItem.preco.toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Lote: {selectedItem.lote.numeroLote}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Validade: {dayjs(selectedItem.lote.dataValidade).format("DD/MM/YYYY")}
                                </Typography>
                            </Paper>
                        )}

                        {/* QUANTIDADE */}
                        <Controller
                            name="quantidade"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Quantidade"
                                    type="number"
                                    fullWidth
                                    error={!!errors.quantidade}
                                    helperText={errors.quantidade?.message}
                                />
                            )}
                        />

                        {/* TOTAL */}
                        {selectedItem && (
                            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                <Typography variant="body2">
                                    Total: R$ {valorTotal.toFixed(2)}
                                </Typography>
                            </Paper>
                        )}

                        {/* FORMA PAGAMENTO */}
                        <Controller
                            name="formaPagamento"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    select
                                    fullWidth
                                    label="Forma de Pagamento"
                                    {...field}
                                >
                                    {FormaPagamentoService.dados.map(f => (
                                        <MenuItem key={f.id} value={f.id}>{f.nome}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        {/* OBS */}
                        <Controller
                            name="observacoes"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Observações"
                                    multiline
                                    rows={2}
                                />
                            )}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            Registrar Venda
                        </Button>
                    </Box>
                </form>
            </CardContent>  
        </Card>
    );
}