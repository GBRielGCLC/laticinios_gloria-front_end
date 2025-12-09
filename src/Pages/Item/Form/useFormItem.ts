import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup"; // Assumindo que yup é importado assim ou via um arquivo de config
import { yupResolver } from "@hookform/resolvers/yup";
import { IItem, IItemPOST, ItemService } from "../../../Services/Api/Item";
import { toast } from "react-toastify";
import { UnidadeMedidaService } from "../../../Services";

const validationSchema = yup.object().shape({
    produtoId: yup.number().required(),
    loteId: yup.number().required(),
    unidadeMedida: yup.number().required(),
});

interface IFormItem extends IItemPOST { }

interface UseFormItemProps {
    open: boolean;
    onClose: () => void;
    editingItem?: IItem | null;
    refreshTable?: () => void
}

export function useFormItem({
    open,
    onClose,
    editingItem,
    refreshTable
}: UseFormItemProps) {
    const [isLoading, setIsLoading] = useState(false)

    const isEditing = !!editingItem && !!editingItem.produtoId && !!editingItem.loteId;

    const {
        control,
        handleSubmit: hookFormSubmit,
        reset,
    } = useForm<IFormItem>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            produtoId: undefined,
            loteId: undefined,
            unidadeMedida: undefined,
        },
    });

    useEffect(() => {
        if (open) {
            if (editingItem) {
                const unidadeMedidaId = UnidadeMedidaService.findIdByNome(editingItem.unidadeMedida);

                reset({
                    produtoId: editingItem.produtoId,
                    loteId: editingItem.loteId,
                    unidadeMedida: unidadeMedidaId,
                });
            } else {
                reset();
            }
        }
    }, [editingItem, open, reset]);

    const onSubmitHandler: SubmitHandler<IFormItem> = (data) => {
        setIsLoading(true);

        const dataToSubmit: IItemPOST = data;

        if (isEditing && editingItem) {
            ItemService.editarItem(editingItem.id, dataToSubmit).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                refreshTable?.();
                onClose();
            });
        } else {
            ItemService.cadastrarItem(dataToSubmit).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                toast.success("Item de Lote cadastrado com sucesso!");
                reset();
                refreshTable?.();
            });
        }
    };

    return {
        control,
        isEditing,
        handleSubmit: hookFormSubmit(onSubmitHandler),

        isLoading,
    };
}