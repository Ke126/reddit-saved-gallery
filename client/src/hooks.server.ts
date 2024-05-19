import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import type { IUser } from '$lib';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('HANDLE');
	const jwt = event.cookies.get('jwt');
	if (jwt) {
		const user: IUser = JSON.parse(jwt);
		const FIVE_MIN_IN_MS = 5 * 60 * 1000;
		// check if expired
		if (Date.now() + FIVE_MIN_IN_MS >= user.exp) {
			const response = await fetch('https://www.reddit.com/api/v1/access_token', {
				method: 'POST',
				body: `grant_type=refresh_token&refresh_token=${user.refresh_token}`,
				headers: {
					Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});	
			const json = await response.json();
			user.access_token = json.access_token;
			user.exp = Date.now() + json.expires_in * 1000;
			event.cookies.set('jwt', JSON.stringify(user), { path: '/' });
		}
		event.locals.user = user;
	} else {
		event.locals.user = null;
	}
	const response = await resolve(event);
	return response;
};
