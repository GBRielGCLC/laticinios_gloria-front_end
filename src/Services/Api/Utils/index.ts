export interface BaseApiResponse<T> {
    dados: T[],
    totalRegistros: number,
    totalPaginas: number,
}

export interface IPagination {
    pagina: number,
    tamanhoPagina: number,
}
export const defaultPaginationsData: IPagination = {
    pagina: 1,
    tamanhoPagina: 10
}

/**
 * Converte um objeto com filtros para query string.
 * Ignora valores null/undefined e strings vazias.
 * 
 * @param filters Objeto com filtros { pagina: 1, tamanhoPagina: 10 }
 * @returns string -> "?pagina=1&tamanhoPagina=10"
 */
export function queryToString(filters: Record<string, any>): string {
    if (!filters) return "";

    const params = Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "") // remove null/undefined e strings vazias
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // encode p/ evitar erro com espaços
        .join("&");

    return params ? `?${params}` : "";
}