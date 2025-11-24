import { Api } from "../Axios-Config";
import { BaseApiResponse } from "../Utils";

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
const listarProdutos = async (): Promise<IProdutoGET | Error> => {
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

const excluirProduto = async (id: any): Promise<void | Error> => {
  try {
    await Api.delete(`${ENTIDADE_API}/${id}`);
  } catch (error: any) {
    return error;
  }
};

export const ProdutoService = {
  listarProdutos,
  cadastrarProduto,
  editarProduto,
  excluirProduto,
}