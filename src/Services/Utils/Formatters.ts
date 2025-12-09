import dayjs from "dayjs";

const formatadorMonetario = (valor?: number | null | string): string => {
    if (valor === undefined || valor === null || valor === "") {
        return "R$ 0,00";
    }

    let numero: number;

    if (typeof valor === "number") {
        numero = valor;
    } else {
        const normalizado = valor
            .replace(/[^\d,-]/g, "")
            .replace(",", ".");

        numero = parseFloat(normalizado);

        if (isNaN(numero)) {
            numero = 0;
        }
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const formatadorDataVisual = (value?: string | null): string => {
    if (!value) return "";

    // Se já estiver no formato DD/MM/YYYY, apenas retorna
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        return value;
    }

    const data = dayjs(value);

    // Verifica validade da data
    if (!data.isValid()) {
        return "";
    }

    return data.format("DD/MM/YYYY");
};


export const Formatters = {
    formatadorMonetario,
    formatadorDataVisual
};