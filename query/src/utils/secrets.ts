import fs from 'node:fs';

function loadSecret(secretName: string): string {
    let secret = process.env[secretName] || '';
    const fileKey = secretName + '_FILE';
    // throw an exception if file does not exist
    if (process.env[fileKey]) {
        secret = fs.readFileSync(process.env[fileKey], 'utf8');
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

export function getMongoUsername(): string {
    return loadSecretRequired('MONGO_INITDB_ROOT_USERNAME');
}

export function getMongoPassword(): string {
    return loadSecretRequired('MONGO_INITDB_ROOT_PASSWORD');
}
