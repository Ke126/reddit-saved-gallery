// See https://kit.svelte.dev/docs/types#app

import type { Subreddit, RedditCard } from '$lib/types/reddit';
import type { UserCookie } from '$lib/types/user';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserCookie | null;
		}
		interface PageData {
			subreddits?: Subreddit[];
			posts?: {
				total_count: number;
				count: number;
				page: number;
				posts: RedditCard[];
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
