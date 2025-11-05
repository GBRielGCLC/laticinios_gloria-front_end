import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yup } from "../../../Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import { IProduto } from "../../../Services/Api/Produto";

interface IFormInput {
    name: string;
    costPrice: number;
    profitMargin: number;
    quantity: number;
    expiryDate: Dayjs | null;
}

const validationSchema = yup.object({
    name: yup.string().required(),
    costPrice: yup
        .number()
        .min(0, "O custo deve ser maior que zero")
        .required(),
    profitMargin: yup
        .number()
        .required(),
    quantity: yup
        .number()
        .integer()
        .required(),
    expiryDate: yup.mixed<Dayjs>()
        .required()
        .nullable()
        .test('is-dayjs', 'Data inválida.', (value) => dayjs.isDayjs(value)),
});

interface UseFormProdutoProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<IProduto, "id"> | IProduto) => void;
    editingProduct?: IProduto | null;
}

export function useFormProduto({
    open,
    onClose,
    onSubmit,
    editingProduct,
}: UseFormProdutoProps) {

    const isEditing = !!editingProduct;

    const {
        control,
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<IFormInput>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: "",
            costPrice: undefined,
            profitMargin: 30,
            quantity: undefined,
            expiryDate: null,
        },
    });

    const costPrice = watch("costPrice");
    const profitMargin = watch("profitMargin");

    const calculateSalePrice = (cost: number, margin: number) => {
        const costValue = Number(cost) || 0;
        const marginValue = Number(margin) || 0;
        return costValue + (costValue * marginValue) / 100;
    };

    const calculatedSalePrice = calculateSalePrice(costPrice, profitMargin);

    useEffect(() => {
        if (open) {
            if (editingProduct) {
                reset({
                    name: editingProduct.name,
                    costPrice: editingProduct.costPrice,
                    profitMargin: editingProduct.profitMargin,
                    quantity: editingProduct.quantity,
                    expiryDate: editingProduct.expiryDate,
                });
            } else {
                reset();
            }
        }
    }, [editingProduct, open, reset]);

    const onSubmitHandler: SubmitHandler<IFormInput> = (data) => {
        const salePrice = calculateSalePrice(data.costPrice, data.profitMargin);

        const productData = {
            ...data,
            salePrice: salePrice,
            initialQuantity: editingProduct
                ? editingProduct.initialQuantity
                : data.quantity,
            discount: editingProduct ? editingProduct.discount : 0,
        };

        if (editingProduct) {
            onSubmit({ ...productData, id: editingProduct.id });
        } else {
            onSubmit(productData);
        }

        onClose(); // Fechar o modal
    };

    return {
        control,
        register,
        errors,
        isEditing,
        calculatedSalePrice,
        handleSubmit: hookFormSubmit(onSubmitHandler),
    };
}