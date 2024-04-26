import { writable } from 'svelte/store';
import type { Post, Subreddit } from '$lib';

export const postStore = writable<Post[]>([]);
export const subredditStore = writable<Subreddit[]>([]);
