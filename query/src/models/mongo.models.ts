import { RedditPost } from "../shared/reddit.models.js"

export interface RedditPostDoc extends RedditPost {
    _id: string,
}

interface NestedRedditPostDoc {
    post_id: string,
    saved_at: number,
    favorited: boolean
}

export interface UserDoc {
    _id: string,
    posts: NestedRedditPostDoc[]
}

export interface JoinedDoc extends RedditPostDoc {
    favorited: boolean,
    saved_at: number,
}