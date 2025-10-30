import { useState } from "react";
import {
    CssBaseline,
    Container,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    IconButton,
    PaletteMode,
    useTheme,
} from '@mui/material';
import { Add, Storefront, LightMode, DarkMode } from '@mui/icons-material';
import {
    PersonalizedToast,
    ProductForm,
    Dashboard,
    InventoryTable,
    SalesInterface,
    Product,
} from './Components';
import { useAppThemeContext } from "./Contexts";

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

export const PaginaTeste = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [mode, setMode] = useState<PaletteMode>('light');

    const { toggleTheme } = useAppThemeContext();

    const handleAddProduct = (productData: Omit<Product, "id"> | Product) => {
        if ("id" in productData) {
            // Editando produto existente
            setProducts(products.map(p => p.id === productData.id ? productData : p));
        } else {
            // Adicionando novo produto
            const newProduct: Product = {
                ...productData,
                id: Date.now().toString(),
            };
            setProducts([...products, newProduct]);
        }
        setEditingProduct(null);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

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

    const handleDiscard = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const handleApplyDiscount = (id: string, discount: number) => {
        setProducts(products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    discount: discount,
                };
            }
            return product;
        }));
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    return (
        <>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: 'secondary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                            }}
                        >
                            <Storefront sx={{ color: 'secondary.contrastText' }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">Laticínios Glória</Typography>
                            <Typography variant="caption" sx={{ color: 'primary.contrastText', opacity: 0.8 }}>
                                Sistema de Gerenciamento de Estoque
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={toggleTheme}
                            color="inherit"
                            sx={{ ml: 2 }}
                        >
                            {mode === 'light' ? <DarkMode /> : <LightMode />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                            <Tab label="Painel" />
                            <Tab label="Estoque" />
                            <Tab label="Vendas" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Dashboard products={products} />

                            {products.length === 0 && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Comece Agora</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Adicione seu primeiro produto para começar a gerenciar o estoque
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                            onClick={() => setIsFormOpen(true)}
                                        >
                                            Adicionar Primeiro Produto
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="h5">Controle de Estoque</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Gerencie produtos, preços, margens de lucro e validades
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => setIsFormOpen(true)}
                                >
                                    Adicionar Produto
                                </Button>
                            </Box>

                            <InventoryTable
                                products={products}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                                onDiscard={handleDiscard}
                                onApplyDiscount={handleApplyDiscount}
                            />
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Typography variant="h5">Gerenciamento de Vendas</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Registre vendas e atualize o estoque automaticamente
                                </Typography>
                            </Box>

                            <Box sx={{ maxWidth: 500 }}>
                                <SalesInterface products={products} onSale={handleSale} />
                            </Box>
                        </Box>
                    </TabPanel>
                </Container>
            </Box>

            <ProductForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleAddProduct}
                editingProduct={editingProduct}
            />

        </>
    )
}