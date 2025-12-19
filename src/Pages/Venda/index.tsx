import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import { AddShoppingCart, PointOfSale } from "@mui/icons-material";
import { useState } from "react";
import { FormVenda } from "./FormVenda";
import { Formatters } from "../../Services/Utils/Formatters";
import { useVenda } from "./useVenda";
import { CardVenda } from "./CardVenda";

export function Venda() {
    const [openVenda, setOpenVenda] = useState(false);

    const {
        vendas,
        isLoadingVenda,

        handleDelete
    } = useVenda();

    return (
        <Box sx={{ p: 3 }}>

            {/* AÇÕES + KPIs */}
            <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">

                {/* TOTAL VENDIDO */}
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

                {/* QUANTIDADE DE VENDAS */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Vendas realizadas
                        </Typography>
                        <Typography variant="h6">
                            {vendas.dados.length}
                        </Typography>
                    </Paper>
                </Grid>

                {/* BOTÃO NOVA VENDA */}
                <Grid
                    size={{ xs: 12, sm: 4 }}
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "stretch", sm: "flex-end" },
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddShoppingCart />}
                        onClick={() => setOpenVenda(true)}
                        fullWidth={false}
                    >
                        Nova Venda
                    </Button>
                </Grid>
            </Grid>

            {/* LISTA DE VENDAS */}
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Histórico de Vendas
                    </Typography>

                    {isLoadingVenda ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 4,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : vendas.dados.length === 0 ? (
                        <Box
                            sx={{
                                py: 6,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: "text.secondary",
                            }}
                        >
                            <PointOfSale sx={{ fontSize: 48, mb: 1 }} />
                            <Typography>
                                Nenhuma venda registrada ainda
                            </Typography>
                            <Typography variant="body2">
                                Clique em <strong>Nova Venda</strong> para começar
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {vendas.dados.map(venda => (
                                <Grid
                                    key={venda.id}
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                        md: 4,
                                        lg: 3,
                                        xl: 2,
                                    }}
                                >
                                    <CardVenda venda={venda} onDelete={handleDelete}/>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* MODAL DE VENDA */}
            <FormVenda
                open={openVenda}
                onClose={() => setOpenVenda(false)}
            />
        </Box>
    );
}