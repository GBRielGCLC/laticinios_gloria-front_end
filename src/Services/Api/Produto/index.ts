import { Dayjs } from "dayjs";
import { Api, BaseApiResponse } from "../Axios-Config";

export interface IProduto {
  id: number;
  nome: string;
  precoUnitario: number;
  descricao: string;
}

// MESMA INTERFACE MAS SEM O ID
export interface IProdutoPOST extends Omit<IProduto, "id"> { }

const ENTIDADE_API = "Produto";

export type IProdutoGET = BaseApiResponse<IProduto>
const listarProdutos = async(): Promise<IProdutoGET | Error> => {
  try {
    const { data } = await Api.get(ENTIDADE_API);

    return data;
  } catch (error: any) {
    return error;
  }
}

const cadastrarProduto = async (produto: IProdutoPOST) => {
  try {
    await Api.post(ENTIDADE_API, produto);
  } catch (error) {
    return error;
  }
};

const editarProduto = async (id: any, produto: IProdutoPOST) => {
  try {
    await Api.put(`${ENTIDADE_API}/${id}`, produto);
  } catch (error) {
    return error;
  }
};

export const ProdutoService = {
  listarProdutos,
  cadastrarProduto,
  editarProduto
}