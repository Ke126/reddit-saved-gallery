import { env } from '$env/dynamic/private';
import fs from 'node:fs';

// throw an exception if the secret is unset or empty
function loadSecret(secretName: string): string {
	let secret = env[secretName] || '';
	const fileKey = secretName + '_FILE';
	// throw an exception if file does not exist
	if (env[fileKey]) {
		secret = fs.readFileSync(env[fileKey], 'utf8');
	}
	// throw an exception if secret is still empty
	if (!secret) {
		throw new Error(`${secretName} is unset or empty`);
	}
	return secret;
}

// exit if the secret is unset or empty
function loadSecretRequired(secretName: string): string {
	try {
		const secret = loadSecret(secretName);
		return secret;
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

// use the fallback value if the secret is unset or empty
function loadSecretOptional(secretName: string, fallback: string): string {
	try {
		const secret = loadSecret(secretName);
		return secret;
	} catch {
		return fallback;
	}
}

export const secrets = {
	// process should exist if not present
	OAUTH_CLIENT_ID: loadSecretRequired('OAUTH_CLIENT_ID'),
	OAUTH_CLIENT_SECRET: loadSecretRequired('OAUTH_CLIENT_SECRET'),
	// can generate new key/iv at startup if none is present
	AES_KEY: loadSecretOptional('AES_KEY', ''),
	AES_IV: loadSecretOptional('AES_IV', '')
};
