import { useState } from "react";
import {
    Container,
    Box,
    Tabs,
    Tab,
} from '@mui/material';

import { Produto } from "../Produto";
import { Lote } from "../Lote";

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

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <Container maxWidth={false} sx={{ py: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab label="Painel" />
                        <Tab label="Produtos" />
                        <Tab label="Lotes" />
                        <Tab label="Vendas" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {/* <Dashboard products={produtos.dados} /> */}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Produto />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Lote />
                </TabPanel>

                {/* <TabPanel value={tabValue} index={3}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Venda products={produtos.dados} />
                    </Box>
                </TabPanel> */}
            </Container>
        </Box>
    )
}