import { Box, Tabs, Tab } from "@mui/material";
import { useHome } from "./useHome";
import { tabs } from "./tabs";

export const Home = () => {
    const {  tabValue, handleTabChange } = useHome();

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                p: 4
            }}
        >
            {/* TABS */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    {tabs.map(tab => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* PANEL */}
            {tabs.map(tab => {
                if (tab.value !== tabValue) return null;

                const Component = tab.component;

                return (
                    <Box
                        key={tab.value}
                        role="tabpanel"
                        sx={{ py: 3 }}
                    >
                        {Component ? <Component /> : null}
                    </Box>
                );
            })}
        </Box>
    );
};