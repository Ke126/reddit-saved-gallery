import { env } from '$env/dynamic/private';
import fs from 'node:fs/promises';

let CLIENT_ID: string;
let CLIENT_SECRET: string;

export async function getOAuth2ClientId(): Promise<string> {
	if (CLIENT_ID) return CLIENT_ID;
	if (env.NODE_ENV === 'production') {
		CLIENT_ID = await fs.readFile(env.CLIENT_ID_FILE!, 'utf-8');
	} else {
		CLIENT_ID = env.CLIENT_ID!;
	}
	return CLIENT_ID;
}

export async function getOAuth2ClientSecret() {
	if (CLIENT_SECRET) return CLIENT_SECRET;
	if (env.NODE_ENV === 'production') {
		CLIENT_SECRET = await fs.readFile(env.CLIENT_SECRET_FILE!, 'utf-8');
	} else {
		CLIENT_SECRET = env.CLIENT_SECRET!;
	}
	return CLIENT_SECRET;
}
