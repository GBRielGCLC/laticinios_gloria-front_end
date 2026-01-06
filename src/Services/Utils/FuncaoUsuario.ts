export interface IFuncaoUsuario {
    id: number;
    nome: string;
}

const FuncoesUsuario: IFuncaoUsuario[] = [
    { id: 1, nome: 'Gestor' },
    { id: 2, nome: 'Funcionario' },
];

/**
 * Encontra o objeto completo da Função do Usuário pelo ID.
 * @param id O ID numérico da função (ex: 1)
 * @returns O objeto IFuncaoUsuario ou undefined.
 */
const findById = (id: number): IFuncaoUsuario | undefined => {
    return FuncoesUsuario.find(f => f.id === id);
};

/**
 * Encontra o NOME da Função do Usuário pelo ID.
 * @param id O ID numérico da função (ex: 1)
 * @returns O nome (string) da função (ex: 'Gestor') ou undefined.
 */
const findNomeById = (id: number): string | undefined => {
    return findById(id)?.nome;
};

/**
 * Encontra o objeto completo da Função do Usuário pelo nome.
 * @param nome O nome da função (ex: 'Gestor')
 * @returns O objeto IFuncaoUsuario ou undefined.
 */
const findByNome = (nome: string): IFuncaoUsuario | undefined => {
    return FuncoesUsuario.find(
        f => f.nome.toUpperCase() === nome.toUpperCase()
    );
};

/**
 * Encontra o ID da Função do Usuário pelo nome.
 * @param nome O nome da função (ex: 'Gestor')
 * @returns O ID numérico (ex: 1) ou undefined.
 */
const findIdByNome = (nome: string): number | undefined => {
    return findByNome(nome)?.id;
};

export const FuncaoUsuarioService = {
    dados: FuncoesUsuario,
    findById,
    findNomeById,
    findByNome,
    findIdByNome,
};
