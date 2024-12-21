import type { RedditThing, Subreddit } from '$lib/types/reddit';

export interface GetPostsResponseBody {
	count: number;
	total_count: number;
	page: number;
	posts: RedditThing[];
}

export interface GetSubredditsResponseBody {
	subreddits: Subreddit[];
}

export interface AccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export interface MeResponse {
	name: string;
	icon_img: string;
}
