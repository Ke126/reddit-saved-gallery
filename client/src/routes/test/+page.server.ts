import type { PageServerLoad, Actions } from './$types';

export const actions = {
	pin: async ({ locals, request }) => {
		const form = await request.formData();
		console.log(form.get('_id'));
		console.log(form.get('pinned'));
		if (form.get('pinned')) {
			console.log('was true');
		}
	}
} satisfies Actions;
