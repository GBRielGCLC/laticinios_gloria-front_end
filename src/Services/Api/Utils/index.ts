export interface BaseApiResponse<T> {
    dados: T[],
    totalRegistros: number,
    totalPaginas: number,
}

/**
 * Passe um array com os filtros(ex: 'nomeCampo=valorCampo'), a função construirá uma query string com os filtros passados.
 * @param {string[]} query - Array de filtros em string.
 * @returns {string} URL construída, ou então uma string vazia caso não tenha nada.
 */
export function queryToString(query: string[]): string {
    let queryString = query.length > 0 ? `?` : '';

    queryString += query.join('&');

    return queryString;
}