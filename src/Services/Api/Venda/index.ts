import { Api } from "../Axios-Config";
import { BaseApiResponse, IPagination, queryToString } from "../Utils";

export interface IVendaItem {
    itemId: number;
    quantidade: number;
}

export interface IVenda {
    id: number;
    dataVenda: string;
    valorTotal: number;
    formaPagamento: string;
    observacoes?: string;
    itens: IVendaItem[];
}

export interface IVendaPOST extends Omit<IVenda, "id"> { }

export type IVendaGET = BaseApiResponse<IVenda>;

export interface IFiltroVenda {
    dataInicial?: string | null;
    dataFinal?: string | null;
    formaPagamento?: number;
}

export interface IListarVendasProps {
    pagination?: IPagination;
    filtros?: IFiltroVenda;
}

const ENTIDADE_API = "Venda";

const listarVendas = async (
    queryParams?: IListarVendasProps
): Promise<IVendaGET | Error> => {
    try {
        const mergedObj = {
            ...queryParams?.pagination,
            ...queryParams?.filtros,
        };

        const queryString = mergedObj ? queryToString(mergedObj) : "";

        const { data } = await Api.get(ENTIDADE_API + queryString);

        return data;
    } catch (error: any) {
        return error;
    }
};

const cadastrarVenda = async (venda: IVendaPOST): Promise<void | Error> => {
    try {
        await Api.post(ENTIDADE_API, venda);
    } catch (error: any) {
        return error;
    }
};

const excluirVenda = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`${ENTIDADE_API}/${id}`);
    } catch (error: any) {
        return error;
    }
};

/* =========================
 *  EXPORT
 * ========================= */

export const VendaService = {
    listarVendas,
    cadastrarVenda,
    excluirVenda,
};
