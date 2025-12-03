import { Api } from "../Axios-Config";
import { BaseApiResponse, IPagination, queryToString } from "../Utils";

export interface IProduto {
  id: number;
  nome: string;
  precoUnitario: number;
  descricao: string;
}

// MESMA INTERFACE MAS SEM O ID
export interface IProdutoPOST extends Omit<IProduto, "id"> { }

const ENTIDADE_API = "Produto";

export interface IFiltroProduto {
  valor?: string | null;
  ativo?: boolean | null;
}

export interface IListarProdutosProps {
  pagination?: IPagination
  filtros?: IFiltroProduto
}

export type IProdutoGET = BaseApiResponse<IProduto>
const listarProdutos = async ({ pagination, filtros }: IListarProdutosProps): Promise<IProdutoGET | Error> => {
  try {
    let mergedObj = { ...pagination, ...filtros };
    let queryString = mergedObj ? queryToString(mergedObj) : "";

    const { data } = await Api.get(ENTIDADE_API + queryString);

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