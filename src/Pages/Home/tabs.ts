import { Produto } from "../Produto";
import { Lote } from "../Lote";
import { Item } from "../Item";
import { Venda } from "../Venda";
import type { ComponentType } from "react";

interface HomeTab {
    value: string;
    label: string;
    component: ComponentType | null;
}

export const tabs: HomeTab[] = [
    {
        value: "painel",
        label: "Painel",
        component: null, // Dashboard futuramente
    },
    {
        value: "produtos",
        label: "Produtos",
        component: Produto,
    },
    {
        value: "lotes",
        label: "Lotes",
        component: Lote,
    },
    {
        value: "itens",
        label: "Itens",
        component: Item,
    },
    {
        value: "venda",
        label: "Venda",
        component: Venda,
    },
];