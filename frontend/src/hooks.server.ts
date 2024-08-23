import { refreshAccessToken } from '$lib/server/auth';
import { encrypt, decrypt } from '$lib/server/cookie';
import type { UserCookie } from '$lib/types/user';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('HANDLE');
	const jwt = event.cookies.get('auth');
	if (jwt) {
		try {
			const user: UserCookie = JSON.parse(decrypt(jwt));
			const FIVE_MIN_IN_MS = 5 * 60 * 1000;
			// check if expired (within 5 min)
			if (Date.now() + FIVE_MIN_IN_MS >= user.exp_at) {
				const json = await refreshAccessToken(user.refresh_token);
				user.access_token = json.access_token;
				user.exp_at = Date.now() + json.expires_in * 1000;
				event.cookies.set('auth', encrypt(JSON.stringify(user)), { path: '/', maxAge: 86400 });
			}
			event.locals.user = user;
		} catch {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}
	const response = await resolve(event);
	return response;
};
