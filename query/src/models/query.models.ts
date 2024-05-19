export interface QueryRequest {
    q: string,
    in?: string[],
    nin?: string[],
    page: number
}

export interface PinRequest {
    _id: string,
    pinned: boolean
}