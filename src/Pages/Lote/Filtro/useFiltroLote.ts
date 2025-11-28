import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";

export interface IFiltroLoteForm {
    numeroLote?: string;
    dataCompra?: Dayjs | null;
    dataValidade?: Dayjs | null;
}

export function useFiltroLote(onFiltrar: (filtros: any) => void) {

    const { register, control, handleSubmit, reset, formState: { errors } } =
        useForm<IFiltroLoteForm>({
            defaultValues: {
                numeroLote: "",
                dataCompra: null,
                dataValidade: null
            }
        });

    const submit = (data: IFiltroLoteForm) => {
        onFiltrar({
            numeroLote: data.numeroLote || null,
            dataCompra: data.dataCompra ? data.dataCompra.format("YYYY-MM-DD") : null,
            dataValidade: data.dataValidade ? data.dataValidade.format("YYYY-MM-DD") : null
        });
    };

    return {
        register,
        control,
        errors,
        handleSubmit: handleSubmit(submit),
        reset
    };
}
