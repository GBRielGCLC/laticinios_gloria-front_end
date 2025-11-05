import { Dayjs } from "dayjs";
import { Api } from "../Axios-Config";

export interface IProduto {
  id: string;
  name: string;
  costPrice: number;
  profitMargin: number;
  salePrice: number;
  quantity: number;
  initialQuantity: number;
  expiryDate: Dayjs | null;
  discount: number;
}

export const ProdutoService = {
}