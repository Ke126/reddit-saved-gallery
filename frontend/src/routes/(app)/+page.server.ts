import type { GetPostsResponseBody } from '$lib/types/response';
import { formatter } from '$lib/server/formatter';
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { revokeTokens } from '$lib/server/auth';
import { secrets } from '$lib/server/secrets';

export const load: PageServerLoad = async ({ locals, url }) => {
	console.log('LOAD / (page)');
	if (!locals.user) {
		console.log('Not authenticated');
		redirect(301, '/login');
	}
	const fetchurl = new URL(`${secrets.API_SERVER}/posts`);
	url.searchParams.forEach((value: string, key: string) => {
		console.log(key, value);
		fetchurl.searchParams.append(key, value);
	});
	console.log(fetchurl.toString());
	const response = await fetch(fetchurl, {
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

export const actions = {
	pull: async ({ locals }) => {
		console.log('Pull action');
		if (!locals.user) {
			console.log('Not authenticated');
			return fail(401);
			// redirect(301, '/login');
		}
		try {
			const response = await fetch(`${secrets.API_SERVER}/posts`, {
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
			console.log(response.status);
			console.log('Form done');
		}
		catch {
			return fail(500);
		}
	},
	pin: async ({ locals, request }) => {
		console.log('Pin action');
		if (!locals.user) {
			console.log('Not authenticated');
			return fail(401);
			// redirect(301, '/login');
		}
		const form = await request.formData();
		try {
			const response = await fetch(`${secrets.API_SERVER}/posts/${form.get('_id')}`, {
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
		}
		catch {
			return fail(500);
		}
	},
	save: async ({ locals, request }) => {
		console.log('Save action');
		if (!locals.user) {
			console.log('Not authenticated');
			return fail(401);
			// redirect(301, '/login');
		}
		const form = await request.formData();
		try {
			const response = await fetch(`${secrets.API_SERVER}/posts/${form.get('_id')}`, {
				method: form.get('saved') === 'on' ? 'PUT' : 'DELETE',
				headers: {
					authorization: `bearer ${locals.user.access_token}`,
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
				return fail(response.status);
			}
		}
		catch {
			return fail(500);
		}
	},
	logout: async ({ locals, cookies }) => {
		console.log('Logout action');
		await revokeTokens(locals.user!.refresh_token);
		cookies.delete('auth', { path: '/' });
		redirect(301, '/login');
	}
} satisfies Actions;
