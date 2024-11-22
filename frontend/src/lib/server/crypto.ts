import { secrets } from './secrets';
import crypto, { type CipherKey } from 'node:crypto';

const key: CipherKey = secrets.AES_KEY
	? new Uint8Array(Buffer.from(secrets.AES_KEY, 'base64'))
	: crypto.generateKeySync('aes', { length: 256 });

const iv: Uint8Array = secrets.AES_IV
	? new Uint8Array(Buffer.from(secrets.AES_IV, 'base64'))
	: new Uint8Array(crypto.randomBytes(16));

export function encrypt(input: string): string {
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

	let encrypted = cipher.update(input, 'utf8', 'base64');
	encrypted += cipher.final('base64');

	const authTag = cipher.getAuthTag().toString('base64');
	return `${encrypted}.${authTag}`;
}

export function decrypt(input: string): string {
	const [encrypted, authTag] = input.split('.');

	const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
	decipher.setAuthTag(new Uint8Array(Buffer.from(authTag, 'base64')));

	let decrypted = decipher.update(encrypted, 'base64', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}
