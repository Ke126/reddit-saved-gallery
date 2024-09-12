import fs from 'node:fs/promises';

let MONGO_INITDB_ROOT_USERNAME: string;
let MONGO_INITDB_ROOT_PASSWORD: string;

export async function getMongoUsername(): Promise<string> {
    if (MONGO_INITDB_ROOT_USERNAME) return MONGO_INITDB_ROOT_USERNAME;
    if (process.env.NODE_ENV === 'production') {
        MONGO_INITDB_ROOT_USERNAME = await fs.readFile(
            process.env.MONGO_INITDB_ROOT_USERNAME_FILE!,
            'utf-8',
        );
    } else {
        MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME!;
    }
    return MONGO_INITDB_ROOT_USERNAME;
}

export async function getMongoPassword() {
    if (MONGO_INITDB_ROOT_PASSWORD) return MONGO_INITDB_ROOT_PASSWORD;
    if (process.env.NODE_ENV === 'production') {
        MONGO_INITDB_ROOT_PASSWORD = await fs.readFile(
            process.env.MONGO_INITDB_ROOT_PASSWORD_FILE!,
            'utf-8',
        );
    } else {
        MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD!;
    }
    return MONGO_INITDB_ROOT_PASSWORD;
}
