import { env } from '$env/dynamic/private';
import fs from 'node:fs';

function isProdEnv() {
	return env.NODE_ENV === 'production';
}

// each of the *_FILE env variables are passed in at runtime by Docker
// so checking their truthiness allows the build to pass without undefined path argument errors
export const secrets = {
	OAUTH_CLIENT_ID:
		isProdEnv() && env.OAUTH_CLIENT_ID_FILE
			? fs.readFileSync(env.OAUTH_CLIENT_ID_FILE!, 'utf8')
			: env.OAUTH_CLIENT_ID!,
	OAUTH_CLIENT_SECRET:
		isProdEnv() && env.OAUTH_CLIENT_SECRET_FILE
			? fs.readFileSync(env.OAUTH_CLIENT_SECRET_FILE!, 'utf8')
			: env.OAUTH_CLIENT_SECRET!,
	API_SERVER: isProdEnv() ? 'http://api:4000' : 'http://localhost:4000',
	AES_KEY:
		isProdEnv() && env.AES_KEY_FILE ? fs.readFileSync(env.AES_KEY_FILE!, 'utf8') : env.AES_KEY!,
	AES_IV: isProdEnv() && env.AES_IV_FILE ? fs.readFileSync(env.AES_IV_FILE!, 'utf8') : env.AES_IV!
};
