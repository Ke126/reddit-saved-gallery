import { RedditPost } from "../shared/reddit.models.js"

export interface RedditPostDoc extends RedditPost {
    _id: string,
}

export interface UserDoc {
    _id: string,
    posts: {
        post_id: string,
        saved_at: number,
        favorited: boolean
    }[]
}