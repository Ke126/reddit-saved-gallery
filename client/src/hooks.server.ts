import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('HANDLE');
	const jwt = event.cookies.get('jwt');
	if (jwt) {
		event.locals.user = JSON.parse(jwt);
	} else {
		event.locals.user = null;
	}
	const response = await resolve(event);
	return response;
};
