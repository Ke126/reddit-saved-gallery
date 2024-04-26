export interface RedditResponse {
    data: {
        after: string,
        dist: number,
        children: {
            data: RedditPost
        }[]
    }
}

export interface RedditPost {
    name: string;
    title: string;
    subreddit_name_prefixed: string;
    url_overridden_by_dest: string;
    thumbnail: string;
    selftext: string;
    permalink: string;
}