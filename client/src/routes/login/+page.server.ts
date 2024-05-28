import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { CLIENT_ID, REDIRECT_URI } from '$env/static/private';

const scope = 'identity,history,save';

export const load: PageServerLoad = async ({ locals }) => {
	console.log('LOAD /login');
	if (locals.user) {
		redirect(301, '/');
	}
};

export const actions = {
	default: async ({ cookies }) => {
		const state = crypto.randomUUID();
		cookies.set('state', state, { path: '/' });
		redirect(
			301,
			`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=${scope}`
		);
	}
} satisfies Actions;
