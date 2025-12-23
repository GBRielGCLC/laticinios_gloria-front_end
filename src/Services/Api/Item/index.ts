import { Api } from "../Axios-Config";
import { ILote } from "../Lote";
import { IProduto } from "../Produto";
import { BaseApiResponse, IPagination, queryToString } from "../Utils";

export interface IItem {
    id: any;
    produtoId: any;
    loteId: any;
    unidadeMedida: string;
    produto: IProduto;
    lote: ILote;
    itemVenda: any | null;
}

export interface IItemPOST {
    produtoId: any;
    loteId: any;
    unidadeMedida: number;
}

export interface IItemVendaPOST {
    itemId: number;
    quantidade: number;
}

const ENTIDADE_API = "Item";

export type IItemGET = BaseApiResponse<IItem>

export interface IListarItensProps {
    pagination?: IPagination
    filtros?: IFiltroItem
}

export interface IFiltroItem {
    produtoId?: number;
    loteId?: number;
    unidadeMedida?: number;
}

const listarItens = async (queryParams?: IListarItensProps): Promise<IItemGET | Error> => {
    try {
        let mergedObj = { ...queryParams?.pagination, ...queryParams?.filtros };
        let queryString = mergedObj ? queryToString(mergedObj) : "";

        const { data } = await Api.get(ENTIDADE_API + queryString);

        return data;
    } catch (error: any) {
        return error;
    }
}

const cadastrarItem = async (item: IItemPOST): Promise<void | Error> => {
    try {
        await Api.post(ENTIDADE_API, item);
    } catch (error: any) {
        return error;
    }
};

const editarItem = async (id: any, item: IItemPOST): Promise<void | Error> => {
    try {
        await Api.put(`${ENTIDADE_API}/${id}`, item);
    } catch (error: any) {
        return error;
    }
};

const excluirItem = async (id: any): Promise<void | Error> => {
    try {
        await Api.delete(`${ENTIDADE_API}/${id}`);
    } catch (error: any) {
        return error;
    }
};

export const ItemService = {
    listarItens,
    cadastrarItem,
    editarItem,
    excluirItem
}