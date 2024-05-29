import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import type { GetPostsResponseBody, RedditPost, RedditThing } from '$lib';
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	console.log('LOAD /test2 (page)');
};
