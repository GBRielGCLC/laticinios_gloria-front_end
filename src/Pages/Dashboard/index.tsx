import { Card, CardContent, Box, Typography, Grid, useTheme } from '@mui/material';
import {
    Inventory,
    AttachMoney,
    TrendingUp,
    Warning,
    CalendarToday
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { IProduto } from '../../Services/Api/Produto';

interface DashboardProps {
    products: IProduto[];
}

export function Dashboard({ products }: DashboardProps) {
    const theme = useTheme();

    return (
        <Grid container spacing={3}>
            {/* <Grid size={{ xs: 12, sm: 6, md: 4, }} key={index}>
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
            </Grid> */}
        </Grid>
    );
}
