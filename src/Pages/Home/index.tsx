import { useState } from "react";
import {
    Container,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import {
    IProduto,
    Venda,
} from '../../Components';

import { Dashboard, Estoque } from "../index";
import dayjs from "dayjs";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export const Home = () => {
    const [products, setProducts] = useState<IProduto[]>([{
        id: '1',
        name: 'Leite',
        quantity: 10,
        expiryDate: dayjs('2025-12-31'),
        costPrice: 5,
        profitMargin: 10,
        salePrice: 5.5,
        initialQuantity: 10,
        discount: 0
    }]);
    const [tabValue, setTabValue] = useState(0);

    const handleSale = (productId: string, quantity: number) => {
        setProducts(products.map(product => {
            if (product.id === productId) {
                return {
                    ...product,
                    quantity: product.quantity - quantity,
                };
            }
            return product;
        }));
    };

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab label="Painel" />
                        <Tab label="Estoque" />
                        <Tab label="Vendas" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Dashboard products={products} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Estoque
                        produtos={products}
                        setProdutos={setProducts}
                    />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Venda products={products} onSale={handleSale} />
                    </Box>
                </TabPanel>
            </Container>
        </Box>
    )
}