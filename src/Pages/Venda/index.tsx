import {
    Card,
    CardContent,
    MenuItem,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Autocomplete,
    Grid,
    Divider,
} from '@mui/material';
import { ShoppingCart, Delete, AddShoppingCart } from '@mui/icons-material';
import { Controller, useForm } from "react-hook-form";
import { FormaPagamentoService } from '../../Services/Utils/FormaPagamento';
import { Formatters } from '../../Services/Utils/Formatters';
import { useFormVenda } from './useVenda';
import { IItem } from '../../Services/Api/Item';

export function Venda() {
    const {
        control,
        errors,
        handleSubmit,

        controlFinal,
        handleSubmitFinal,

        itens,
        selectedItem,

        carrinho,
        valorItem,
        valorTotal,

        removerItem,
        editarQuantidadeItem,
        registrarVenda,
    } = useFormVenda();

    return (
        <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', maxWidth: 900, mx: "auto" }}>
            <CardContent sx={{ p: 3 }}>

                {/* Cabeçalho */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ShoppingCart color="primary" />
                    <Typography variant="h6">Registrar Venda</Typography>
                </Box>

                {/* -------------------------- */}
                {/* FORM PARA ADICIONAR ITEM   */}
                {/* -------------------------- */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Adicionar Item ao Carrinho
                </Typography>

                <Grid container spacing={2} component='form' noValidate onSubmit={handleSubmit}>

                    {/* ITEM */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="itemId"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={itens}
                                    noOptionsText="Nenhum item encontrado"
                                    getOptionKey={(i: IItem) => i.id}
                                    getOptionLabel={(i: IItem) =>
                                        `${i.produto.nome} — ${Formatters.formatadorMonetario(i.produto.precoUnitario)}`
                                    }
                                    onChange={(_, value) => field.onChange(value?.id)}
                                    value={selectedItem ?? null}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Item"
                                            error={!!errors.itemId}
                                            helperText={errors.itemId?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    {/* QUANTIDADE */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="quantidade"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    label="Quantidade"
                                    type="number"
                                    fullWidth
                                    value={field.value === undefined ? '' : field.value}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                    error={!!errors.quantidade}
                                    helperText={errors.quantidade?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* INFO DO ITEM (Mantendo a estabilidade do layout) */}
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 2, minHeight: 92, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            {selectedItem ? (
                                <>
                                    <Typography variant="body2">
                                        Preço unitário: <strong> {Formatters.formatadorMonetario(selectedItem.produto.precoUnitario)} </strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        Lote: <strong>{selectedItem.lote.numeroLote} </strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color={errors.quantidade?.type === "estoque" ? "error" : "text.primary"}
                                    >
                                        Estoque total: <strong> {selectedItem.lote.quantidade} </strong>
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Selecione um item para ver detalhes
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* SUBTOTAL */}
                    {selectedItem && (
                        <Grid size={{ xs: 12 }}>
                            <Paper sx={{
                                p: 2,
                                bgcolor: 'info.light',
                                color: 'info.contrastText'
                            }}>
                                <Typography variant="body2">
                                    Subtotal (A Adicionar): <strong>{Formatters.formatadorMonetario(valorItem)}</strong>
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    {/* BOTÃO ADICIONAR */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            type='submit'
                            variant="contained"
                            color="info"
                            fullWidth
                            startIcon={<AddShoppingCart />}
                        >
                            Adicionar ao Carrinho
                        </Button>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* -------------------------- */}
                {/*   LISTA DO CARRINHO       */}
                {/* -------------------------- */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Itens no Carrinho ({carrinho.length})
                </Typography>

                {carrinho.length === 0 && (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Nenhum item adicionado.
                    </Typography>
                )}

                {carrinho.map((c, index) => {
                    const item = itens.find(i => i.id === c.itemId);
                    if (!item) return null;

                    const subtotal = item.produto.precoUnitario * c.quantidade;

                    return (
                        <Paper key={item.id} sx={{ p: 2, mb: 1 }}>
                            <Grid container alignItems="center" spacing={2}>

                                {/* NOME E PREÇO */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body1" fontWeight="bold">{item.produto.nome}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Preço Unitário: {Formatters.formatadorMonetario(item.produto.precoUnitario)}
                                    </Typography>
                                </Grid>

                                {/* QUANTIDADE E SUBTOTAL */}
                                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <TextField
                                        label="Qtd."
                                        type="number"
                                        size="small"
                                        value={c.quantidade}
                                        onChange={(e) => {
                                            const novaQtd = Number(e.target.value);
                                            editarQuantidadeItem(item.id, novaQtd);
                                        }}
                                        inputProps={{ min: 1 }}
                                        fullWidth
                                    />
                                    <Typography variant="subtitle2">
                                        Subtotal: <strong> {Formatters.formatadorMonetario(subtotal)} </strong>
                                    </Typography>
                                </Grid>

                                {/* BOTÃO DE REMOÇÃO */}
                                <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        color="error"
                                        onClick={() => removerItem(item.id)}
                                        size="small"
                                        aria-label={`Remover ${item.produto.nome}`}
                                        sx={{ minWidth: 0, p: 0.5 }}
                                    >
                                        <Delete />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    );
                })}

                {/* TOTAL GERAL */}
                {carrinho.length > 0 && (
                    <Paper
                        sx={{
                            p: 2,
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h6">
                            Total Geral:
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                            {Formatters.formatadorMonetario(valorTotal)}
                        </Typography>
                    </Paper>
                )}

                {/* FORM FINAL (PGTO + OBS) */}
                {carrinho.length > 0 && (
                    <form onSubmit={handleSubmitFinal} noValidate>
                        <Grid container spacing={2}>

                            {/* FORMA DE PAGAMENTO */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="formaPagamento"
                                    control={controlFinal}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Forma de Pagamento"
                                            required
                                            select
                                            fullWidth
                                        >
                                            {FormaPagamentoService.dados.map(f => (
                                                <MenuItem key={f.id} value={f.id}>{f.nome}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            {/* OBSERVAÇÕES */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="observacoes"
                                    control={controlFinal}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Observações"
                                            multiline
                                            rows={2}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>

                            {/* SUBMIT VENDA */}
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Registrar Venda
                                </Button>
                            </Grid>

                        </Grid>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}