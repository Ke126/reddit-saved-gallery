import type { RedditThing, SubredditIn } from "$lib/types/reddit";

export interface GetPostsResponseBody {
	count: number;
	total_count: number;
	page: number;
	posts: RedditThing[];
}

export interface GetSubredditsResponseBody {
	subreddits: SubredditIn[];
}