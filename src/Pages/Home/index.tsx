import { useState } from "react";
import {
    Container,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Venda,
} from '../../Components';

import { Dashboard, Produto } from "../index";
import { useHome } from "./useHome";

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
    const [tabValue, setTabValue] = useState(0);

    const {
        produtos,
        isLoading,
        listAllProducts
    } = useHome();

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab label="Painel" />
                        <Tab label="Produtos" />
                        <Tab label="Vendas" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Dashboard products={produtos.dados} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Produto
                        produtos={produtos.dados}
                        isLoadingTable={isLoading}
                        refreshTable={listAllProducts}
                    />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Venda products={produtos.dados} />
                    </Box>
                </TabPanel>
            </Container>
        </Box>
    )
}