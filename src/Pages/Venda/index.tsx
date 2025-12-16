import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Paper,
} from "@mui/material";
import { AddShoppingCart, PointOfSale } from "@mui/icons-material";
import { useState } from "react";
import { FormVenda } from "./FormVenda";

export function Venda() {
    const [openVenda, setOpenVenda] = useState(false);

    return (
        <Box sx={{ p: 3 }}>

            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Vendas
                    </Typography>
                    <Typography color="text.secondary">
                        Gerencie e registre as vendas realizadas
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddShoppingCart />}
                    onClick={() => setOpenVenda(true)}
                >
                    Nova Venda
                </Button>
            </Box>

            {/* KPIs */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Total vendido hoje
                        </Typography>
                        <Typography variant="h6">
                            R$ 0,00
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Vendas realizadas
                        </Typography>
                        <Typography variant="h6">
                            0
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Ticket médio
                        </Typography>
                        <Typography variant="h6">
                            R$ 0,00
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* LISTA DE VENDAS (FUTURO) */}
            <Card>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                        Histórico de Vendas
                    </Typography>

                    {/* ESTADO VAZIO */}
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