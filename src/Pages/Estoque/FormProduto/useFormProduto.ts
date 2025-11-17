import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yup } from "../../../Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduto, IProdutoPOST, ProdutoService } from "../../../Services/Api/Produto";
import { isForInStatement } from "typescript";
import { toast } from "react-toastify";

const validationSchema = yup.object({
    nome: yup.string().required(),
    precoUnitario: yup
        .number()
        .min(0, "O custo deve ser maior que zero")
        .required(),
    descricao: yup.string().required(),
});

interface UseFormProdutoProps {
    open: boolean;
    onClose: () => void;
    editingProduct?: IProduto | null;
    refreshTable?: () => void
}

export function useFormProduto({
    open,
    onClose,
    editingProduct,
    refreshTable
}: UseFormProdutoProps) {
    const [isLoading, setIsLoading] = useState(false)

    const isEditing = !!editingProduct;

    const {
        control,
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<IProdutoPOST>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            nome: "",
            precoUnitario: undefined,
            descricao: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (editingProduct) {
                reset({
                    nome: editingProduct.nome,
                    precoUnitario: editingProduct.precoUnitario,
                    descricao: editingProduct.descricao,
                });
            } else {
                reset();
            }
        }
    }, [editingProduct, open, reset]);

    const onSubmitHandler: SubmitHandler<IProdutoPOST> = (data) => {
        setIsLoading(true);

        if (editingProduct) {
            ProdutoService.editarProduto(editingProduct.id, data).then((result) => {
                setIsLoading(false);

                if(result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                refreshTable?.();
                onClose();
            });
        } else {
            ProdutoService.cadastrarProduto(data).then((result) => {
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