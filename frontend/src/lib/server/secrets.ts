import { env } from '$env/dynamic/private';
import fs from 'node:fs/promises';

// throw an exception if the secret is unset or empty
async function loadSecret(secretName: string): Promise<string> {
	let secret = env[secretName] || '';
	const fileKey = secretName + '_FILE';
	// throw an exception if file does not exist
	if (env[fileKey]) {
		secret = await fs.readFile(env[fileKey], 'utf8');
	}
	// throw an exception if secret is still empty
	if (!secret) {
		throw new Error(`${secretName} is unset or empty`);
	}
	return secret;
}

// use the fallback value if the secret is unset or empty
async function loadSecretOptional(secretName: string, fallback: string): Promise<string> {
	try {
		return await loadSecret(secretName);
	} catch {
		return fallback;
	}
}

interface Secrets {
	OAUTH_CLIENT_ID?: string;
	OAUTH_CLIENT_SECRET?: string;
	AES_KEY_STRING?: string;
}

export const secrets: Secrets = {};

export async function loadAllSecrets() {
	// oauth credentials are required and do not have a fallback
	// if these values do not exist, an exception is thrown
	secrets.OAUTH_CLIENT_ID = await loadSecret('OAUTH_CLIENT_ID');
	secrets.OAUTH_CLIENT_SECRET = await loadSecret('OAUTH_CLIENT_SECRET');

	// aes key is optional and can be generated if needed
	secrets.AES_KEY_STRING = await loadSecretOptional('AES_KEY', '');
}
