export interface PageResponse<T> {
    content: T[],
    currentPage: number,
    totalPages: number,
    totalRecords: number,
}