import type { GetPostsResponseBody } from '$lib/types/response';
import { formatter } from '$lib/server/formatter';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { revokeTokens } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

const API_SERVICE_ADDR = 'http://' + (env.API_SERVICE_ADDR || 'api:4000');

export const load: PageServerLoad = async ({ locals, url }) => {
	console.log('LOAD / (page)');
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
	// non-numeric page numbers ("abc") => 1
	// page numbers < 1 (0, -1, -2.4) => 1
	// decimals > 1 (1.5, 15.7) => Math.floor()
	return {
		posts: {
			total_count: result.total_count,
			count: result.count,
			page: result.page,
			posts: result.posts.map(formatter)
		}
	};
};

export const actions = {
	pull: async ({ locals }) => {
		console.log('POST ?/pull');
		if (!locals.user) {
			console.log('Not authenticated');
			return fail(401);
			// redirect(301, '/login');
		}
		try {
			const response = await fetch(`${API_SERVICE_ADDR}/posts`, {
				method: 'POST',
				body: JSON.stringify({
					username: locals.user.username
				}),
				headers: {
					'Content-Type': 'application/json',
					authorization: `bearer ${locals.user.access_token}`
				}
			});
			if (!response.ok) {
				return fail(response.status);
			}
		} catch {
			return fail(500);
		}
	},
	pin: async ({ locals, request }) => {
		console.log('POST ?/pin');
		if (!locals.user) {
			console.log('Not authenticated');
			return fail(401);
			// redirect(301, '/login');
		}
		const form = await request.formData();
		try {
			const response = await fetch(`${API_SERVICE_ADDR}/posts/${form.get('_id')}`, {
				method: 'PATCH',
				headers: {
					authorization: `bearer ${locals.user.access_token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					pinned: form.get('pinned') === 'on'
				})
			});
			if (!response.ok) {
				return fail(response.status);
			}
		} catch {
			return fail(500);
		}
	},
	save: async ({ locals, request }) => {
		console.log('POST ?/save');
		if (!locals.user) {
			console.log('Not authenticated');
			return fail(401);
			// redirect(301, '/login');
		}
		const form = await request.formData();
		try {
			const response = await fetch(`${API_SERVICE_ADDR}/posts/${form.get('_id')}`, {
				method: form.get('saved') === 'on' ? 'PUT' : 'DELETE',
				headers: {
					authorization: `bearer ${locals.user.access_token}`,
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
				return fail(response.status);
			}
		} catch {
			return fail(500);
		}
	},
	logout: async ({ locals, cookies }) => {
		console.log('POST ?/logout');
		await revokeTokens(locals.user!.refresh_token);
		cookies.delete('auth', { path: '/' });
		redirect(301, '/login');
	}
} satisfies Actions;
