import { secrets } from './secrets';
import crypto, { type CipherKey } from 'node:crypto';

const key: CipherKey = new Uint8Array(Buffer.from(secrets.AES_KEY, 'base64'));
const iv: Uint8Array = new Uint8Array(Buffer.from(secrets.AES_IV, 'base64'));
console.log(key.length);
console.log(iv.length);

export function encrypt(input: string): string {
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

	let encrypted = cipher.update(input, 'utf8', 'base64');
	encrypted += cipher.final('base64');

	const authTag = cipher.getAuthTag().toString('base64');
	return `${encrypted}.${authTag}`;
}

export function decrypt(input: string): string {
	const encrypted = input.split('.')[0];
	const authTag = input.split('.')[1];

	const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
	decipher.setAuthTag(new Uint8Array(Buffer.from(authTag, 'base64')));

	let decrypted = decipher.update(encrypted, 'base64', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}
