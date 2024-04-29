export interface QueryRequest {
    q: string,
    in?: string[],
    nin?: string[],
    page: number
}

export interface FavoriteRequest {
    _id: string,
    favorited: boolean
}