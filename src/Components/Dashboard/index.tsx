import { Card, CardContent, Box, Typography, Grid } from '@mui/material';
import {
    Inventory,
    AttachMoney,
    TrendingUp,
    Warning,
    CalendarToday
} from '@mui/icons-material';
import { Product } from '../ProductForm';
import dayjs from 'dayjs';

interface DashboardProps {
    products: Product[];
}

export function Dashboard({ products }: DashboardProps) {
    const totalProducts = products.length;

    const getFinalPrice = (product: Product) => {
        if (product.discount > 0) {
            return product.salePrice - (product.salePrice * product.discount / 100);
        }
        return product.salePrice;
    };

    const totalInventoryValue = products.reduce((sum, product) => {
        return sum + (getFinalPrice(product) * product.quantity);
    }, 0);

    const totalSold = products.reduce((sum, product) => {
        return sum + (product.initialQuantity - product.quantity);
    }, 0);

    const totalRevenue = products.reduce((sum, product) => {
        const soldQuantity = product.initialQuantity - product.quantity;
        return sum + (soldQuantity * getFinalPrice(product));
    }, 0);

    const totalProfit = products.reduce((sum, product) => {
        const soldQuantity = product.initialQuantity - product.quantity;
        const profit = getFinalPrice(product) - product.costPrice;
        return sum + (soldQuantity * profit);
    }, 0);

    const lowStockProducts = products.filter(p => p.quantity < 10 && p.quantity > 0).length;
    const outOfStockProducts = products.filter(p => p.quantity === 0).length;

    const getExpiryAlerts = () => {
        const today = new Date();
        let expiring = 0;
        let expired = 0;

        products.forEach(product => {
            const expiry = dayjs(product.expiryDate);
            const daysUntilExpiry = expiry.diff(today, 'day');

            if (daysUntilExpiry < 0) {
                expired++;
            } else if (daysUntilExpiry <= 30) {
                expiring++;
            }
        });

        return { expiring, expired };
    };

    const expiryAlerts = getExpiryAlerts();

    const stats = [
        {
            title: "Total de Produtos",
            value: totalProducts,
            description: "Produtos ativos no estoque",
            icon: Inventory,
            color: '#2d4a34',
        },
        {
            title: "Valor do Estoque",
            value: `R$ ${totalInventoryValue.toFixed(2)}`,
            description: "Valor atual em estoque",
            icon: AttachMoney,
            color: '#e5b55d',
        },
        {
            title: "Receita Total",
            value: `R$ ${totalRevenue.toFixed(2)}`,
            description: `${totalSold} unidades vendidas`,
            icon: TrendingUp,
            color: '#2d4a34',
        },
        {
            title: "Lucro Total",
            value: `R$ ${totalProfit.toFixed(2)}`,
            description: "Lucro com vendas realizadas",
            icon: AttachMoney,
            color: '#d4a04c',
        },
        {
            title: "Alertas de Estoque",
            value: lowStockProducts + outOfStockProducts,
            description: `${lowStockProducts} baixo, ${outOfStockProducts} sem estoque`,
            icon: Warning,
            color: '#d97706',
        },
        {
            title: "Alertas de Validade",
            value: expiryAlerts.expiring + expiryAlerts.expired,
            description: `${expiryAlerts.expiring} vencendo, ${expiryAlerts.expired} vencidos`,
            icon: CalendarToday,
            color: '#b91c1c',
        },
    ];

    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Grid size={{xs: 12, sm: 6, md: 4,}} key={index}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        {stat.title}
                                    </Typography>
                                    <Icon sx={{ color: stat.color, fontSize: 20 }} />
                                </Box>
                                <Typography variant="h4" sx={{ mb: 1, fontWeight: 500 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {stat.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}
