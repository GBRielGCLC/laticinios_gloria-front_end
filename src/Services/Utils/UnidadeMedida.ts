export interface IUnidadeMedida {
    id: number;
    nome: string;
    sigla?: string; // Opcional: para mostrar a sigla (g, kg, etc.)
}

const UnidadeMedida: IUnidadeMedida[] = [
    { id: 1, nome: 'Unidade', sigla: 'un' },
    { id: 2, nome: 'Grama', sigla: 'g' },
    { id: 3, nome: 'Quilograma', sigla: 'kg' },
    { id: 4, nome: 'Mililitro', sigla: 'ml' },
    { id: 5, nome: 'Litro', sigla: 'L' },
    { id: 6, nome: 'Metro', sigla: 'm' },
    { id: 7, nome: 'Centimetro', sigla: 'cm' },
];

/**
 * Encontra o objeto completo da Unidade de Medida pelo ID.
 * @param id O ID numérico da unidade de medida (ex: 5)
 * @returns O objeto IUnidadeMedida ou undefined.
 */
const findById = (id: number): IUnidadeMedida | undefined => {
    return UnidadeMedida.find(u => u.id === id);
};

/**
 * Encontra o NOME da Unidade de Medida pelo ID.
 * @param id O ID numérico da unidade de medida (ex: 5)
 * @returns O nome (string) da unidade de medida (ex: 'Litro') ou undefined.
 */
const findNomeById = (id: number): string | undefined => {
    return findById(id)?.nome;
};

/**
 * Encontra o objeto completo da Unidade de Medida pelo nome.
 * @param nome O nome da unidade de medida (ex: 'Litro')
 * @returns O objeto IUnidadeMedida ou undefined.
 */
const findByNome = (nome: string): IUnidadeMedida | undefined => {
    return UnidadeMedida.find(u => u.nome.toUpperCase() === nome.toUpperCase());
};

/**
 * Encontra o ID da Unidade de Medida pelo nome.
 * @param nome O nome da unidade de medida (ex: 'Litro')
 * @returns O ID numérico (ex: 5) ou undefined.
 */
const findIdByNome = (nome: string): number | undefined => {
    return findByNome(nome)?.id;
};

export const UnidadeMedidaService = {
    dados: UnidadeMedida,
    findById,
    findNomeById,
    findByNome,
    findIdByNome,
};