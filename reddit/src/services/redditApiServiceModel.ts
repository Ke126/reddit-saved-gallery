export interface IRedditApiService {
    pullSavedPosts: (jwt: string, username: string) => Promise<void>,
    savePost: (jwt: string, id: string) => Promise<void>,
    unsavePost: (jwt: string, id: string) => Promise<void>,
}