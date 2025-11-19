import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yup } from "../../../Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILote, ILotePOST, LoteService } from "../../../Services/Api/Lote";
import { isForInStatement } from "typescript";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
    numeroLote: yup.string().required(),
    quantidade: yup.number().min(1, "A quantidade deve ser maior que zero").required(),
    valorLoteCompra: yup.number().min(0, "O valor da compra deve ser maior ou igual a zero").required(),
    dataCompra: yup.string().required(),
    dataValidade: yup.string().required(),
});

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
        watch,
        reset,
    } = useForm<ILotePOST>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            numeroLote: "",
            quantidade: undefined,
            valorLoteCompra: undefined,
            dataCompra: "",
            dataValidade: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (editingProduct) {
                reset({
                    numeroLote: editingProduct.numeroLote,
                    quantidade: editingProduct.quantidade,
                    valorLoteCompra: editingProduct.valorLoteCompra,
                    dataCompra: editingProduct.dataCompra,
                    dataValidade: editingProduct.dataValidade,
                });
            } else {
                reset();
            }
        }
    }, [editingProduct, open, reset]);

    const onSubmitHandler: SubmitHandler<ILotePOST> = (data) => {
        setIsLoading(true);

        if (editingProduct) {
            LoteService.editarLote(editingProduct.numeroLote, data).then((result) => {
                setIsLoading(false);

                if(result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                refreshTable?.();
                onClose();
            });
        } else {
            LoteService.cadastrarLote(data).then((result) => {
                setIsLoading(false);

                if(result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

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