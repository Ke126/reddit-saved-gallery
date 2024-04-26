export interface QueryRequest {
    q: string,
    include?: string[],
    exclude?: string[],
    page: number
}

export interface FavoriteRequest {
    _id: string,
    favorite: boolean
}