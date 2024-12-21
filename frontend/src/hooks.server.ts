import { getUserInfo, refreshAccessToken } from '$lib/server/auth';
import { encrypt, decrypt } from '$lib/server/crypto';
import type { UserCookie } from '$lib/types/user';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('HANDLE');
	const authCookieStr = event.cookies.get('auth');
	if (authCookieStr) {
		try {
			const user: UserCookie = JSON.parse(await decrypt(authCookieStr));
			const FIVE_MIN_IN_MS = 5 * 60 * 1000;
			// check if expired (within 5 min)
			if (Date.now() + FIVE_MIN_IN_MS >= user.exp_at) {
				const json1 = await refreshAccessToken(user.refresh_token);
				const json2 = await getUserInfo(json1.access_token);
				const cookie: UserCookie = {
					username: json2.name,
					icon_img: json2.icon_img,
					access_token: json1.access_token,
					refresh_token: json1.refresh_token,
					exp_at: Date.now() + json1.expires_in * 1000
				};
				event.cookies.set('auth', await encrypt(JSON.stringify(cookie)), {
					path: '/',
					maxAge: 86400
				});
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
