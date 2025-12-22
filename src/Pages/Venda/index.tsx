import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Paper,
    CircularProgress,
    TextField,
    MenuItem,
    Pagination,
} from "@mui/material";
import {
    AddShoppingCart,
    PointOfSale,
    Search,
} from "@mui/icons-material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { FormVenda } from "./FormVenda";
import { Formatters } from "../../Services/Utils/Formatters";
import { useVenda } from "./useVenda";
import { CardVenda } from "./CardVenda";
import { FormaPagamentoService } from "../../Services/Utils/FormaPagamento";

export function Venda() {
    const [openVenda, setOpenVenda] = useState(false);

    const {
        vendas,
        isLoadingVenda,
        pagination,
        handleChangePage,
        handleDelete,
        form,
        handleBuscar,
    } = useVenda();

    const { control } = form;

    return (
        <Box sx={{ p: 3 }}>
            {/* KPIs + AÇÕES */}
            <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Total vendido
                        </Typography>
                        <Typography variant="h6">
                            {Formatters.formatadorMonetario(0)}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Vendas realizadas
                        </Typography>
                        <Typography variant="h6">
                            {vendas.totalRegistros}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid
                    size={{ xs: 12, sm: 4 }}
                    sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-end" } }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddShoppingCart />}
                        onClick={() => setOpenVenda(true)}
                    >
                        Nova Venda
                    </Button>
                </Grid>
            </Grid>

            {/* FILTROS */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} component='form' onSubmit={handleBuscar} noValidate>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="dataVenda"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Data da venda"
                                        value={field.value}
                                        onChange={field.onChange}
                                        slotProps={{
                                            textField: { fullWidth: true },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="formaPagamento"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        label="Forma de Pagamento"
                                        required
                                    >
                                        <MenuItem value="">Todas</MenuItem>

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

                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="observacoes"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Observações"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="outlined"
                                startIcon={<Search />}
                            >
                                Buscar
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* LISTA */}
            <Card>
                <CardContent>
                    {isLoadingVenda ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : vendas.dados.length === 0 ? (
                        <Box
                            py={6}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            color="text.secondary"
                        >
                            <PointOfSale sx={{ fontSize: 48, mb: 1 }} />
                            <Typography>Nenhuma venda encontrada</Typography>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                {vendas.dados.map(venda => (
                                    <Grid
                                        key={venda.id}
                                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                    >
                                        <CardVenda
                                            venda={venda}
                                            onDelete={handleDelete}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            <Box mt={4} display="flex" justifyContent="center">
                                <Pagination
                                    count={vendas.totalPaginas}
                                    page={pagination.pagina}
                                    onChange={handleChangePage}
                                    color="primary"
                                />
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>

            <FormVenda
                open={openVenda}
                onClose={() => setOpenVenda(false)}
            />
        </Box>
    );
}