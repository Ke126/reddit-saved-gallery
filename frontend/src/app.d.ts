// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Subreddit, RedditCard } from '$lib/types/reddit';
import type { UserCookie } from '$lib/types/user';

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
