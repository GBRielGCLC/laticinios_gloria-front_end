import { Api } from "../Axios-Config";
import { BaseApiResponse, IPagination, queryToString } from "../Utils";

export interface ILote {
    id: any;
    numeroLote: string;
    quantidade: number;
    valorLoteCompra: number;
    dataCompra: string;
    dataValidade: string;
}

// MESMA INTERFACE MAS SEM O ID
export interface ILotePOST extends Omit<ILote, "id"> { }

const ENTIDADE_API = "Lote";

export type ILoteGET = BaseApiResponse<ILote>

export interface IListarLotesProps {
    pagination?: IPagination
    filtros?: IFiltroLote
}

export interface IFiltroLote {
    numeroLote?: string;
    dataCompra?: string | null;
    dataValidade?: string | null;
}

const listarLotes = async (queryParams?: IListarLotesProps): Promise<ILoteGET | Error> => {
    try {
        let mergedObj = {...queryParams?.pagination, ...queryParams?.filtros};
        let queryString = mergedObj ? queryToString(mergedObj) : "";

        const { data } = await Api.get(ENTIDADE_API + queryString);

        return data;
    } catch (error: any) {
        return error;
    }
}

const cadastrarLote = async (lote: ILotePOST) => {
    try {
        await Api.post(ENTIDADE_API, lote);
    } catch (error) {
        return error;
    }
};

const editarLote = async (id: any, lote: ILotePOST) => {
    try {
        await Api.put(`${ENTIDADE_API}/${id}`, lote);
    } catch (error) {
        return error;
    }
};

const excluirLote = async (id: any): Promise<void | Error> => {
  try {
    await Api.delete(`${ENTIDADE_API}/${id}`);
  } catch (error: any) {
    return error;
  }
};

export const LoteService = {
    listarLotes,
    cadastrarLote,
    editarLote,
    excluirLote
}