/**
 * Interface que representa uma forma de pagamento.
 * 
 * Cada forma de pagamento possui:
 * - id: identificador numérico único
 * - nome: descrição de exibição
 */
export interface IFormaPagamento {
    id: number;
    nome: string;
}

/**
 * Lista fixa contendo todas as formas de pagamento disponíveis.
 * 
 * Esta lista serve tanto para exibição em selects,
 * quanto para conversão de valores vindos da API.
 */
const FormaPagamento: IFormaPagamento[] = [
    { id: 1, nome: "Dinheiro" },
    { id: 2, nome: "Cartão de Crédito" },
    { id: 3, nome: "Cartão de Débito" },
    { id: 4, nome: "Pix" },
];

/**
 * Retorna o objeto completo da forma de pagamento com base no ID informado.
 *
 * @param id Número identificador da forma de pagamento
 * @returns Objeto correspondente ou undefined caso não exista
 */
const findById = (id: number): IFormaPagamento | undefined => {
    return FormaPagamento.find(f => f.id === id);
};

/**
 * Retorna o nome da forma de pagamento com base no ID informado.
 *
 * @param id Número identificador da forma de pagamento
 * @returns Nome correspondente ou undefined caso não exista
 */
const findNomeById = (id: number): string | undefined => {
    return findById(id)?.nome;
};

/**
 * Retorna o objeto completo da forma de pagamento com base no nome informado.
 *
 * A comparação ignora maiúsculas/minúsculas.
 *
 * @param nome Nome da forma de pagamento
 * @returns Objeto correspondente ou undefined caso não exista
 */
const findByNome = (nome: string): IFormaPagamento | undefined => {
    return FormaPagamento.find(
        f => f.nome.toUpperCase() === nome.toUpperCase()
    );
};

/**
 * Retorna o ID da forma de pagamento com base no nome informado.
 *
 * @param nome Nome da forma de pagamento
 * @returns ID correspondente ou undefined caso não exista
 */
const findIdByNome = (nome: string): number | undefined => {
    return findByNome(nome)?.id;
};

/**
 * Serviço contendo todas as funções utilitárias relacionadas
 * às formas de pagamento disponíveis.
 * 
 * - dados: lista completa para uso em selects
 * - findById: obtém objeto pelo ID
 * - findNomeById: obtém nome pelo ID
 * - findByNome: obtém objeto pelo nome
 * - findIdByNome: obtém ID pelo nome
 */
export const FormaPagamentoService = {
    dados: FormaPagamento,
    findById,
    findNomeById,
    findByNome,
    findIdByNome,
};
