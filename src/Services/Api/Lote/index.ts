import { Api } from "../Axios-Config";
import { BaseApiResponse } from "../Utils";

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
const listarLotes = async (): Promise<ILoteGET | Error> => {
    try {
        const { data } = await Api.get(ENTIDADE_API);

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

export const LoteService = {
    listarLotes,
    cadastrarLote,
    editarLote
}