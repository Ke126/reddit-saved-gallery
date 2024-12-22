import { secrets } from './secrets';
import { webcrypto } from 'node:crypto';

const KEY_SIZE = 256;
const IV_SIZE = 96;
let key: CryptoKey;

export async function generateAesKey() {
	// key string is empty, generate a new key
	if (!secrets.AES_KEY_STRING) {
		console.log('Generating new key');
		key = await webcrypto.subtle.generateKey(
			{
				name: 'AES-GCM',
				length: KEY_SIZE
			},
			false,
			['encrypt', 'decrypt']
		);
		return;
	}
	// key string is not empty, attempt to parse
	console.log('Attempting to use existing key');
	const rawKey = Buffer.from(secrets.AES_KEY_STRING, 'base64');
	key = await webcrypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function generateIv() {
	return webcrypto.getRandomValues(new Uint8Array(IV_SIZE / 8));
}

export async function encrypt(plaintext: string): Promise<string> {
	const iv = generateIv();
	const ciphertext = await webcrypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: iv
		},
		key,
		new TextEncoder().encode(plaintext)
	);
	// prepend the iv to the ciphertext
	return Buffer.from(iv).toString('base64') + Buffer.from(ciphertext).toString('base64');
}

export async function decrypt(payload: string): Promise<string> {
	// extract the iv and the ciphertext from the payload
	const iv = Buffer.from(payload.slice(0, 16), 'base64');
	const ciphertext = Buffer.from(payload.slice(16), 'base64');
	const plaintext = await webcrypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: iv
		},
		key,
		ciphertext
	);
	return new TextDecoder().decode(plaintext);
}
