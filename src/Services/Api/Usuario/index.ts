import { Api } from "../Axios-Config";
import { BaseApiResponse, IPagination, queryToString } from "../Utils";

export interface IUsuario {
    id: any;
    nome: string;
    email: string;
    senha: string;
    ativo: boolean;
    funcao: string | number;
}

// MESMA INTERFACE MAS SEM O ID
export interface IUsuarioPOST extends Omit<IUsuario, "id"> { }

const ENTIDADE_API = "Usuario";

export type IUsuarioGET = BaseApiResponse<IUsuario>;

export interface IListarUsuariosProps {
    pagination?: IPagination;
    filtros?: IFiltroUsuario;
}

export interface IFiltroUsuario {
    nome?: string;
    email?: string;
    ativo?: boolean;
    funcao?: number;
}


const listarUsuarios = async (
    queryParams?: IListarUsuariosProps
): Promise<IUsuarioGET | Error> => {
    try {
        const mergedObj = {
            ...queryParams?.pagination,
            ...queryParams?.filtros
        };

        const queryString = mergedObj ? queryToString(mergedObj) : "";

        const { data } = await Api.get(ENTIDADE_API + queryString);

        return data;
    } catch (error: any) {
        return error;
    }
};

const cadastrarUsuario = async (usuario: IUsuarioPOST) => {
    try {
        await Api.post(ENTIDADE_API, usuario);
    } catch (error: any) {
        return error;
    }
};

const editarUsuario = async (id: any, usuario: Omit<IUsuarioPOST, "id" | "senha" | "funcao">) => {
    try {
        await Api.put(`${ENTIDADE_API}/${id}`, usuario);
    } catch (error: any) {
        return error;
    }
};

const excluirUsuario = async (id: any): Promise<void | Error> => {
    try {
        await Api.delete(`${ENTIDADE_API}/${id}`);
    } catch (error: any) {
        return error;
    }
};

export const UsuarioService = {
    listarUsuarios,
    cadastrarUsuario,
    editarUsuario,
    excluirUsuario
};
