import type { PageServerLoad } from './$types';
import { REDIRECT_URI, CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { UserCookie } from '$lib/types/user';

export const load: PageServerLoad = async ({ url, cookies }) => {
	console.log('LOAD /callback');
	const auth_code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	if (auth_code && state === cookies.get('state')) {
		cookies.delete('state', { path: '/' });
		const response = await fetch('https://www.reddit.com/api/v1/access_token', {
			method: 'POST',
			body: `grant_type=authorization_code&code=${auth_code}&redirect_uri=${REDIRECT_URI}`,
			headers: {
				Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		if (response.ok) {
			const json = await response.json();
			console.log(json);
			const response2 = await fetch('https://oauth.reddit.com/api/v1/me', {
				headers: {
					Authorization: `Bearer ${json.access_token}`
				}
			});
			if (response2.ok) {
				const json2 = await response2.json();
				// console.log(json2);
				const cookie: UserCookie = {
					username: json2.name,
					icon_img: json2.icon_img,
					access_token: json.access_token,
					refresh_token: json.refresh_token,
					exp_at: Date.now() + json.expires_in * 1000
				};
				cookies.set('jwt', JSON.stringify(cookie), { path: '/' });
			}
		}
	}
	redirect(301, '/');
};
