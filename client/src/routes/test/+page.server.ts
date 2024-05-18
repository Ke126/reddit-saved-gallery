import type { PageServerLoad, Actions } from './$types';

export const actions = {
	favorite: async ({ locals, request }) => {
		const form = await request.formData();
        console.log(form.get('_id'));
        console.log(form.get('favorited'));
        if (form.get('favorited')) {
            console.log("was true")
        }
	}
} satisfies Actions;
