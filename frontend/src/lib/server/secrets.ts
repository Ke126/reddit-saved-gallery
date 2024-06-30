import { env } from '$env/dynamic/private';
import fs from 'node:fs/promises';

let OAUTH2_CLIENT_ID: string;
let OAUTH2_CLIENT_SECRET: string;

export async function getOAuth2ClientId(): Promise<string> {
	if (OAUTH2_CLIENT_ID) return OAUTH2_CLIENT_ID;
	if (env.NODE_ENV === 'production') {
		OAUTH2_CLIENT_ID = await fs.readFile(env.OAUTH2_CLIENT_ID_FILE!, 'utf-8');
	} else {
		OAUTH2_CLIENT_ID = env.OAUTH2_CLIENT_ID!;
	}
	return OAUTH2_CLIENT_ID;
}

export async function getOAuth2ClientSecret() {
	if (OAUTH2_CLIENT_SECRET) return OAUTH2_CLIENT_SECRET;
	if (env.NODE_ENV === 'production') {
		OAUTH2_CLIENT_SECRET = await fs.readFile(env.OAUTH2_CLIENT_SECRET_FILE!, 'utf-8');
	} else {
		OAUTH2_CLIENT_SECRET = env.OAUTH2_CLIENT_SECRET!;
	}
	return OAUTH2_CLIENT_SECRET;
}
