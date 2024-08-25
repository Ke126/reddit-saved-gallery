import type { PageServerLoad } from './$types';
import { encrypt } from '$lib/server/crypto';
import { redirect } from '@sveltejs/kit';
import type { UserCookie } from '$lib/types/user';
import { getAccessToken, getUserInfo } from '$lib/server/auth';

export const load: PageServerLoad = async ({ url, cookies }) => {
	console.log('LOAD /callback');
	const authorizationCode = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	if (authorizationCode && state === cookies.get('state')) {
		cookies.delete('state', { path: '/' });
		const json1 = await getAccessToken(authorizationCode);
		const json2 = await getUserInfo(json1.access_token);
		const cookie: UserCookie = {
			username: json2.name,
			icon_img: json2.icon_img,
			access_token: json1.access_token,
			refresh_token: json1.refresh_token,
			exp_at: Date.now() + json1.expires_in * 1000
		};
		cookies.set('auth', encrypt(JSON.stringify(cookie)), { path: '/', maxAge: 86400 });
	}
	redirect(301, '/');
};
