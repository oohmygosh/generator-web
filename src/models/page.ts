export interface Page<T> {
    current: number,
    optimizeCountSql: boolean,
    orders: [],
    pages: number,
    records: T[],
    searchCount: boolean,
    size: number,
    total: number
}