import { useForm } from "react-hook-form";
import { yup } from "../../../Yup";
import { yupResolver } from "@hookform/resolvers/yup";

const filtroSchema = yup.object({
    valor: yup
        .string()
        .nullable()
        .optional(),

    ativo: yup.boolean().default(true)
});

export function useFiltroProduto(onFiltrar: (filtros: any) => void) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            valor: "",
            ativo: true,
        },
        resolver: yupResolver(filtroSchema),
    });


    const submit = (data: any) => {
        onFiltrar(data);
    };

    return {
        control,
        errors,
        handleSubmit: handleSubmit(submit),
        reset
    };
}