import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Collapse,
    Grid,
} from "@mui/material";
import {
    ExpandMore,
    Delete,
    ReceiptLong,
} from "@mui/icons-material";
import { useState } from "react";
import { Formatters } from "../../Services/Utils/Formatters";
import { IVenda } from "../../Services/Api/Venda";
import { FormaPagamentoService } from "../../Services/Utils/FormaPagamento";

interface CardVendaProps {
    venda: IVenda;
    onDelete?: (id: number) => void;
}

export function CardVenda({ venda, onDelete }: CardVendaProps) {
    const [open, setOpen] = useState(false);

    const formaPagamento = FormaPagamentoService.findByNome(venda.formaPagamento);
    const Icon = formaPagamento?.icon;
    const chipColor = formaPagamento?.color ?? "default";

    return (
        <Card
            sx={{
                mb: 2,
                borderLeft: "6px solid",
                borderColor: "primary.main",
            }}
        >
            <CardContent>
                {/* HEADER */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Data da Venda
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {Formatters.formatadorDataVisual(venda.dataVenda)}
                        </Typography>
                    </Box>

                    <Typography variant="h6" color="primary" fontWeight="bold">
                        {Formatters.formatadorMonetario(venda.valorTotal)}
                    </Typography>
                </Box>

                {/* INFO PRINCIPAL */}
                <Grid container spacing={1} mb={1}>
                    <Grid>
                        <Chip
                            label={venda.formaPagamento}
                            icon={Icon ? <Icon color={formaPagamento?.color} /> : undefined}
                            variant="outlined"

                            // @ts-expect-error
                            // Caso a cor do ícone seja permitido no chip aparecerá
                            color={formaPagamento?.color ?? "default"}
                        />
                    </Grid>

                    <Grid>
                        <Chip
                            label={`${venda.itens.length === 1 ? '1 item' : `${venda.itens.length} itens`}`}
                            color="secondary"
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                {/* OBSERVAÇÕES */}
                {venda.observacoes && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {venda.observacoes}
                        </Typography>
                    </>
                )}

                {/* AÇÕES */}
                <Box
                    mt={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {venda.itens.length > 0 && (
                        <IconButton
                            onClick={() => setOpen(prev => !prev)}
                            aria-label="expandir detalhes"
                        >
                            <ExpandMore
                                sx={{
                                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s",
                                }}
                            />
                        </IconButton>
                    )}

                    {onDelete && (
                        <IconButton
                            color="error"
                            onClick={() => onDelete(venda.id)}
                            aria-label="excluir venda"
                        >
                            <Delete />
                        </IconButton>
                    )}
                </Box>

                {/* DETALHES (COLLAPSE) */}
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        Itens da Venda
                    </Typography>

                    {venda.itens.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            color="text.secondary"
                        >
                            • Item #{item.itemId} — Quantidade: {item.quantidade}
                        </Typography>
                    ))}
                </Collapse>
            </CardContent>
        </Card>
    );
}