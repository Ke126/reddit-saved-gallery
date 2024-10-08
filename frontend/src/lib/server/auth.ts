import { env } from '$env/dynamic/private';
import type { AccessTokenResponse, MeResponse } from '$lib/types/response';
import { redirect } from '@sveltejs/kit';
import { secrets } from './secrets';

const scope = 'identity,history,save';
const REDIRECT_URI = `${env.ORIGIN}/callback`;

export async function startOAuthFlow(state: string) {
	return redirect(
		301,
		`https://www.reddit.com/api/v1/authorize?client_id=${secrets.OAUTH_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=${scope}`
	);
}

export async function getAccessToken(authorizationCode: string) {
	const response = await fetch('https://www.reddit.com/api/v1/access_token', {
		method: 'POST',
		body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${REDIRECT_URI}`,
		headers: {
			Authorization: `Basic ${btoa(`${secrets.OAUTH_CLIENT_ID}:${secrets.OAUTH_CLIENT_SECRET}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
	if (!response.ok) throw new Error(`Bad response code ${response.status} from Reddit`);
	const json = await response.json();
	return json as AccessTokenResponse;
}

export async function refreshAccessToken(refreshToken: string) {
	const response = await fetch('https://www.reddit.com/api/v1/access_token', {
		method: 'POST',
		body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
		headers: {
			Authorization: `Basic ${btoa(`${secrets.OAUTH_CLIENT_ID}:${secrets.OAUTH_CLIENT_SECRET}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
	if (!response.ok) throw new Error(`Bad response code ${response.status} from Reddit`);
	const json = await response.json();
	return json as AccessTokenResponse;
}

export async function getUserInfo(accessToken: string) {
	const response = await fetch('https://oauth.reddit.com/api/v1/me', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!response.ok) throw new Error(`Bad response code ${response.status} from Reddit`);
	const json = await response.json();
	return json as MeResponse;
}

export async function revokeTokens(refreshToken: string) {
	const response = await fetch('https://www.reddit.com/api/v1/revoke_token', {
		method: 'POST',
		body: `token=${refreshToken}&token_type_hint=refresh_token`,
		headers: {
			Authorization: `Basic ${btoa(`${secrets.OAUTH_CLIENT_ID}:${secrets.OAUTH_CLIENT_SECRET}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
	if (!response.ok) throw new Error(`Bad response code ${response.status} from Reddit`);
}
