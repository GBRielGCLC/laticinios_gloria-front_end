import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yup } from "../../../Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILote, ILotePOST, LoteService } from "../../../Services/Api/Lote";
import { isForInStatement } from "typescript";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";

const validationSchema = yup.object().shape({
    numeroLote: yup.string().required(),
    quantidade: yup.number().min(1, "A quantidade deve ser maior que zero").required(),
    valorLoteCompra: yup.number().required().transform((value, originalValue) => {
            if (typeof originalValue === "string") {
                const semMascara = originalValue
                    .replace(/[R$\s.]/g, "")
                    .replace(",", ".");

                return Number(semMascara);
            }
            return value;
        }),

    dataCompra: yup.mixed<Dayjs>()
        .required()
        .nullable()
        .test('is-dayjs', 'Data de compra inválida.', (value) => dayjs.isDayjs(value)),
    dataValidade: yup.mixed<Dayjs>()
        .required()
        .nullable()
        .test('is-dayjs', 'Data de validade inválida.', (value) => dayjs.isDayjs(value))
});

interface IFormLote extends Omit<ILotePOST, "dataCompra" | "dataValidade"> {
    dataCompra: Dayjs | null;
    dataValidade: Dayjs | null;
}

interface UseFormLoteProps {
    open: boolean;
    onClose: () => void;
    editingProduct?: ILote | null;
    refreshTable?: () => void
}

export function useFormLote({
    open,
    onClose,
    editingProduct,
    refreshTable
}: UseFormLoteProps) {
    const [isLoading, setIsLoading] = useState(false)

    const isEditing = !!editingProduct;

    const {
        control,
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormLote>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            numeroLote: "",
            quantidade: undefined,
            valorLoteCompra: undefined,
            dataCompra: null,
            dataValidade: null,
        },
    });

    useEffect(() => {
        if (open) {
            if (editingProduct) {
                reset({
                    numeroLote: editingProduct.numeroLote,
                    quantidade: editingProduct.quantidade,
                    valorLoteCompra: editingProduct.valorLoteCompra,
                    dataCompra: dayjs(editingProduct.dataCompra),
                    dataValidade: dayjs(editingProduct.dataValidade),
                });
            } else {
                reset();
            }
        }
    }, [editingProduct, open, reset]);

    const onSubmitHandler: SubmitHandler<IFormLote> = (data) => {
        setIsLoading(true);

        const dataToSubmit: ILotePOST = {
            ...data,

            dataCompra: data.dataCompra?.format("YYYY-MM-DD") ?? "",
            dataValidade: data.dataValidade?.format("YYYY-MM-DD") ?? "",
        };

        if (editingProduct) {
            LoteService.editarLote(editingProduct.id, dataToSubmit).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                refreshTable?.();
                onClose();
            });
        } else {
            LoteService.cadastrarLote(dataToSubmit).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                toast.success("Lote cadastrado com sucesso!");
                reset();
                refreshTable?.();
            });
        }
    };

    return {
        control,
        register,
        errors,
        isEditing,
        handleSubmit: hookFormSubmit(onSubmitHandler),

        isLoading,
    };
}