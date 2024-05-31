// See https://kit.svelte.dev/docs/types#app

import type { IUser, Subreddit, RedditPost } from '$lib/types/reddit';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser | null;
		}
		interface PageData {
			subreddits?: Subreddit[];
			posts?: {
				total_count: number;
				count: number;
				page: number;
				posts: RedditPost[];
			};
			user?: {
				username: string;
				icon_img: string;
			};
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
