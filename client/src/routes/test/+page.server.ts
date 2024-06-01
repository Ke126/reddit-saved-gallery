import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const actions = {
	default: async ({ locals, request }) => {
		console.log("action");
		redirect(300, '/test');
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ locals }) => {
	console.log('LOAD');
};