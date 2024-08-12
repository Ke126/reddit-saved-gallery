import { env } from '$env/dynamic/private';
import fs from 'node:fs';

function isProdEnv() {
	return env.NODE_ENV === 'production';
}

export const secrets = {
	OAUTH_CLIENT_ID: isProdEnv() ? fs.readFileSync(env.OAUTH_CLIENT_ID_FILE!, 'utf8') : env.OAUTH_CLIENT_ID!,
	OAUTH_CLIENT_SECRET: isProdEnv() ? fs.readFileSync(env.OAUTH_CLIENT_SECRET_FILE!, 'utf8') : env.OAUTH_CLIENT_SECRET!,
	API_SERVER: isProdEnv() ? 'http://api:4000' : 'http://localhost:4000',
	AES_KEY: isProdEnv() ? fs.readFileSync(env.AES_KEY_FILE!, 'utf8') : env.AES_KEY!,
	AES_IV: isProdEnv() ? fs.readFileSync(env.AES_IV_FILE!, 'utf8') : env.AES_IV!,
}