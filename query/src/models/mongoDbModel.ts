export interface RedditThing {
    data: {
        name: string
    }
}

export interface RedditThingDoc extends RedditThing {
    _id: string,
    data: {
        name: string,

    }
}

export interface JoinedDoc extends RedditThingDoc {
    pinned: boolean,
    saved_at: number,
}

export interface ReadResult {
    posts: JoinedDoc[],
    count: number,
    total_count: number,
    page: number,
}

export interface UserDoc {
    _id: string,
    posts: {
        post_id: string,
        saved_at: number,
        pinned: boolean
    }[]
}

export interface Subreddit {
    subreddit: string,
    count: number,
}