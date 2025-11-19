import {
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
import dayjs, { Dayjs } from 'dayjs';
import { PersonalizedDataGrid } from '../../../Components/PersonalizedDataGrid';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IProduto, ProdutoService } from '../../../Services/Api/Produto';
import { useConfirm } from '../../../Contexts';
import { toast } from 'react-toastify';

interface InventoryTableProps {
    products: IProduto[];
    onClickEdit?: (product: IProduto) => void;
    isLoading?: boolean
    refreshTable?: () => void
}

export function InventoryTable({
    products,
    onClickEdit,
    isLoading = false,
    refreshTable,
}: InventoryTableProps) {
    const confirmDialog = useConfirm();

    const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduto | null>(null);
    const [discountValue, setDiscountValue] = useState("");

    const getExpiryStatus = (expiryDate: Dayjs | null) => {
        if (!expiryDate) {
            // No expiry date provided: treat as "no expiry" and use a large positive days value
            return { label: "Sem Validade", color: "default" as const, days: Number.POSITIVE_INFINITY };
        }

        const today = dayjs();
        const expiry = dayjs(expiryDate);
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

    interface HandleDeleteProdutoProps{
        id: any;
        setLoading: (v: boolean) => void
        close: () => void;
    }
    const handleDeleteProduto = (props: HandleDeleteProdutoProps) => {
        props.setLoading(true);

        ProdutoService.excluirProduto(props.id).then((result) => {
            props.setLoading(false);

            if (result instanceof Error) {
                toast.error(result.message);
                return;
            }

            toast.success("Produto excluido com sucesso!");
            refreshTable?.();
            props.close();
        })
    }

    const columns: GridColDef<IProduto>[] = [
        {
            field: 'nome',
            headerName: 'Produto',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            minWidth: 180,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {params.value}
                    {params.row.discount > 0 && (
                        <Chip label={`-${params.row.discount}%`} size="small" color="secondary" />
                    )}
                </Box>
            ),
        },
        {
            field: 'descricao',
            headerName: 'Descricão',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
        },
        {
            field: 'precoUnitario',
            headerName: 'Preço Unitário',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            width: 100,
            valueFormatter: (value: number) => `R$ ${value.toFixed(2)}`,
        },
        {
            field: 'actions',
            headerName: 'Ações',
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => {
                const expiryStatus = getExpiryStatus(params.row.expiryDate);
                const product = params.row;

                return (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        {(expiryStatus.days <= 30 && expiryStatus.days >= 0) && (
                            <IconButton
                                size="small"
                                // onClick={() => handleDiscountClick(product)}
                                title="Aplicar desconto"
                                color="secondary"
                            >
                                <Percent fontSize="small" />
                            </IconButton>
                        )}

                        {expiryStatus.days < 0 && (
                            <IconButton
                                size="small"
                                // onClick={() => handleDiscard(product)}
                                title="Descartar produto"
                                color="error"
                            >
                                <Warning fontSize="small" />
                            </IconButton>
                        )}

                        <IconButton
                            size="small"
                            onClick={() => onClickEdit?.(product)}
                            color="primary"
                        >
                            <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => {
                                confirmDialog({
                                    titulo: 'Excluir produto',
                                    conteudo: 'Tem certeza que deseja excluir o produto?',
                                    onConfirm: async ({ close, setLoading }) => handleDeleteProduto({
                                        id: product.id,
                                        setLoading,
                                        close
                                    }),
                                })
                            }}
                            color="error"
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    return (
        <>
            <PersonalizedDataGrid
                columns={columns}
                rows={products}
                loading={isLoading}
            />

            <Dialog open={discountDialogOpen} onClose={() => setDiscountDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Aplicar Desconto</DialogTitle>

                <DialogContent>
                    {selectedProduct && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>

                                <Typography>Produto: {selectedProduct.nome}</Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Preço original: R$ {selectedProduct.precoUnitario.toFixed(2)}
                                </Typography>

                                {/* <Typography variant="body2" color="text.secondary">
                                    Validade: {dayjs(selectedProduct.expiryDate).locale('pt-br').format('L')}
                                </Typography> */}
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

                            {/* {discountValue && parseFloat(discountValue) > 0 && (
                                <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                    <Typography>
                                        Preço com desconto: R$ {(selectedProduct.salePrice - (selectedProduct.salePrice * parseFloat(discountValue) / 100)).toFixed(2)}
                                    </Typography>
                                </Paper>
                            )} */}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDiscountDialogOpen(false)} color="inherit">
                        Cancelar
                    </Button>

                    {/* <Button onClick={handleApplyDiscount} variant="contained" color="primary">
                        Aplicar Desconto
                    </Button> */}
                </DialogActions>
            </Dialog>
        </>
    );
}
