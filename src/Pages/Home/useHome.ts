import { useState } from "react";

export const useHome = () => {
    const [tabValue, setTabValue] = useState(
        localStorage.getItem("tabValue") ?? "painel"
    );

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
        localStorage.setItem("tabValue", newValue);
    };

    return {
        tabValue,
        handleTabChange,
    };
};
