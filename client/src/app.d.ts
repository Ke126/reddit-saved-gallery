// See https://kit.svelte.dev/docs/types#app

import type { IUser } from "$lib";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser | null;
		}
		interface PageData {
			subreddits: {subreddit: string, count: number, checked: boolean}[]
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
