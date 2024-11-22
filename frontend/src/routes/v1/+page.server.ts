import type { GetPostsResponseBody } from '$lib/types/response';
import { formatter } from '$lib/server/formatter';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const API_SERVICE_ADDR = 'http://' + (env.API_SERVICE_ADDR || 'api:4000');

export const load: PageServerLoad = async ({ locals, url }) => {
	console.log('LOAD /v1 (page)');
	if (!locals.user) {
		console.log('Not authenticated');
		redirect(301, '/login');
	}
	console.log(`GET ${url}`);
	const fetchUrl = new URL(`${API_SERVICE_ADDR}/posts`);
	url.searchParams.forEach((value: string, key: string) => {
		fetchUrl.searchParams.append(key, value);
	});
	const response = await fetch(fetchUrl, {
		headers: {
			authorization: `bearer ${locals.user.access_token}`
		}
	});
	const result = (await response.json()) as GetPostsResponseBody;
	return {
		posts: {
			total_count: result.total_count,
			count: result.count,
			page: result.page,
			posts: result.posts.map(formatter)
		}
	};
};

// actions are reused from /(app)
