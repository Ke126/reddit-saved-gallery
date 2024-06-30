import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { startOAuth2Flow } from '$lib/server/auth';

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
		// redirect
		await startOAuth2Flow(state);
	}
} satisfies Actions;
