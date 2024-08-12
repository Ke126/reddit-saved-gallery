import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { GetSubredditsResponseBody } from '$lib/types/response';
import { secrets } from '$lib/server/secrets';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('LOAD / (layout)');
	if (!locals.user) {
		console.log('Not authenticated');
		redirect(301, '/login');
	}
	const response = await fetch(`${secrets.API_SERVER}/subreddits`, {
		headers: {
			authorization: `bearer ${locals.user.access_token}`
		}
	});
	const json = (await response.json()) as GetSubredditsResponseBody;
	return {
		subreddits: json.subreddits,
		user: {
			username: locals.user.username,
			icon_img: locals.user.icon_img
		}
	};
};
