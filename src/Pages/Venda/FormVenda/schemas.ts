import dayjs, { Dayjs } from "dayjs";
import { yup } from "../../../Yup";
import { IItem, IItemVendaPOST } from "../../../Services/Api/Item";

export interface ItemFormData {
    itemId: number;
    quantidade: number;
}

export const createItemVendaSchema = (
    itens: IItem[],
    carrinho: IItemVendaPOST[]
): yup.ObjectSchema<ItemFormData> =>
    yup.object({
        itemId: yup
            .number()
            .required("Selecione um item"),

        quantidade: yup
            .number()
            .required("Informe a quantidade")
            .min(1, "Quantidade mínima é 1")
            .test(
                "estoque",
                "Quantidade maior que o estoque",
                function (value) {
                    const parent = this.parent as ItemFormData;
                    const selected = itens.find(i => i.id === parent.itemId);

                    if (!selected || !value) return true;

                    const qCarrinho = carrinho
                        .filter(c => c.itemId === parent.itemId)
                        .reduce((acc, c) => acc + c.quantidade, 0);

                    return value + qCarrinho <= selected.lote.quantidade;
                }
            ),
    }).required();

export interface VendaFinalFormData {
    dataVenda: Dayjs | null;
    formaPagamento: number;
    observacoes?: string;
}

export const schemaFinal: yup.ObjectSchema<VendaFinalFormData> =
    yup.object({
        dataVenda: yup
            .mixed<Dayjs>()
            .nullable()
            .required("Informe a data da venda")
            .test(
                "data-valida",
                "Data da venda inválida",
                (value) => value ? value.isValid() : false
            )
            .test(
                "data-maxima",
                "A data da venda não pode ser futura",
                (value) =>
                    value ? value.isSame(dayjs(), "day") || value.isBefore(dayjs(), "day") : false
            ),

        formaPagamento: yup
            .number()
            .required("Selecione a forma de pagamento")
            .typeError("Selecione a forma de pagamento"),

        observacoes: yup
            .string()
            .optional()
            .max(255, "Observações podem ter no máximo 255 caracteres"),
    })
        .required();