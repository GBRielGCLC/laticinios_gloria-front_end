import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    Autocomplete,
    Grid,
    Divider,
    IconButton,
} from '@mui/material';
import {
    ShoppingCart,
    Delete,
    AddShoppingCart,
    Close,
} from '@mui/icons-material';
import { Controller } from "react-hook-form";
import { FormaPagamentoService } from '../../../Services/Utils/FormaPagamento';
import { Formatters } from '../../../Services/Utils/Formatters';
import { IItem } from '../../../Services/Api/Item';
import { useFormVenda } from './useFormVenda';
import { DatePicker } from '@mui/x-date-pickers';

interface FormVendaProps {
    open: boolean;
    onClose: () => void;
}

export function FormVenda({ open, onClose }: FormVendaProps) {
    const {
        control,
        errors,
        handleSubmit,

        controlFinal,
        errorsFinal,
        handleSubmitFinal,

        itens,
        selectedItem,

        carrinho,
        valorItem,
        valorTotal,

        removerItem,
        editarQuantidadeItem,
    } = useFormVenda();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            {/* TÍTULO */}
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart color="primary" />
                Registrar Venda

                <IconButton
                    onClick={onClose}
                    sx={{ ml: 'auto' }}
                    aria-label="Fechar"
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* -------------------------- */}
                {/* FORM PARA ADICIONAR ITEM   */}
                {/* -------------------------- */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Adicionar Item ao Carrinho
                </Typography>

                <Grid
                    container
                    spacing={2}
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                >
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
                                        `${i.produto.nome} — ${Formatters.formatadorMonetario(
                                            i.produto.precoUnitario
                                        )}`
                                    }
                                    onChange={(_, value) =>
                                        field.onChange(value?.id)
                                    }
                                    value={selectedItem ?? null}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Item"
                                            error={!!errors.itemId}
                                            helperText={
                                                errors.itemId?.message
                                            }
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
                                    value={
                                        field.value === undefined
                                            ? ''
                                            : field.value
                                    }
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ''
                                                ? undefined
                                                : Number(
                                                    e.target.value
                                                )
                                        )
                                    }
                                    error={!!errors.quantidade}
                                    helperText={
                                        errors.quantidade?.message
                                    }
                                />
                            )}
                        />
                    </Grid>

                    {/* INFO DO ITEM */}
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            sx={{
                                p: 2,
                                minHeight: 92,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            {selectedItem ? (
                                <>
                                    <Typography variant="body2">
                                        Preço unitário:
                                        <strong>
                                            {" "}
                                            {Formatters.formatadorMonetario(
                                                selectedItem.produto
                                                    .precoUnitario
                                            )}
                                        </strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        Lote:
                                        <strong>
                                            {" "}
                                            {
                                                selectedItem.lote
                                                    .numeroLote
                                            }
                                        </strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color={
                                            errors.quantidade?.type ===
                                                "estoque"
                                                ? "error"
                                                : "text.primary"
                                        }
                                    >
                                        Estoque total:
                                        <strong>
                                            {" "}
                                            {
                                                selectedItem.lote
                                                    .quantidade
                                            }
                                        </strong>
                                    </Typography>
                                </>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Selecione um item para ver detalhes
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* SUBTOTAL */}
                    {selectedItem && (
                        <Grid size={{ xs: 12 }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: 'info.light',
                                    color: 'info.contrastText',
                                }}
                            >
                                <Typography variant="body2">
                                    Subtotal:
                                    <strong>
                                        {" "}
                                        {Formatters.formatadorMonetario(
                                            valorItem
                                        )}
                                    </strong>
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    {/* BOTÃO ADICIONAR */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            type="submit"
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
                {/* LISTA DO CARRINHO          */}
                {/* -------------------------- */}
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Itens no Carrinho ({carrinho.length})
                </Typography>

                {carrinho.length === 0 && (
                    <Typography color="text.secondary">
                        Nenhum item adicionado.
                    </Typography>
                )}

                {carrinho.map((c) => {
                    const item = itens.find(
                        (i) => i.id === c.itemId
                    );
                    if (!item) return null;

                    const subtotal =
                        item.produto.precoUnitario * c.quantidade;

                    return (
                        <Paper key={item.id} sx={{ p: 2, mb: 1 }}>
                            <Grid
                                container
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography fontWeight="bold">
                                        {item.produto.nome}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {Formatters.formatadorMonetario(
                                            item.produto.precoUnitario
                                        )}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                        label="Qtd."
                                        type="number"
                                        size="small"
                                        value={c.quantidade}
                                        onChange={(e) =>
                                            editarQuantidadeItem(
                                                item.id,
                                                Number(e.target.value)
                                            )
                                        }
                                        fullWidth
                                    />
                                    <Typography variant="subtitle2">
                                        Subtotal:
                                        <strong>
                                            {" "}
                                            {Formatters.formatadorMonetario(
                                                subtotal
                                            )}
                                        </strong>
                                    </Typography>
                                </Grid>

                                <Grid
                                    size={{ xs: 12, sm: 2 }}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            removerItem(item.id)
                                        }
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    );
                })}

                {/* TOTAL */}
                {carrinho.length > 0 && (
                    <Paper
                        sx={{
                            p: 2,
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            mt: 2,
                        }}
                    >
                        <Typography variant="h6">
                            Total Geral:
                            <strong>
                                {" "}
                                {Formatters.formatadorMonetario(
                                    valorTotal
                                )}
                            </strong>
                        </Typography>
                    </Paper>
                )}

                {/* FORM FINAL */}
                {carrinho.length > 0 && (
                    <Box
                        component="form"
                        onSubmit={handleSubmitFinal}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="formaPagamento"
                                    control={controlFinal}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label="Forma de Pagamento"
                                            required
                                        >
                                            {FormaPagamentoService.dados.map(
                                                (f) => (
                                                    <MenuItem
                                                        key={f.id}
                                                        value={f.id}
                                                    >
                                                        {f.nome}
                                                    </MenuItem>
                                                )
                                            )}
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    name="dataVenda"
                                    control={controlFinal}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Data da venda"
                                            value={field.value}
                                            onChange={field.onChange}
                                            disableFuture
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errorsFinal.dataVenda,
                                                    helperText: errorsFinal.dataVenda?.message
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
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
                        </Grid>
                    </Box>
                )}

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit"> Cancelar </Button>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmitFinal}
                >
                    Registrar Venda
                </Button>
            </DialogActions>
        </Dialog>
    );
}