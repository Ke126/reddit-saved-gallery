import { ILogger } from '../shared/logger.models.js';
import 'dotenv/config';
import type { RedditResponse } from '../shared/reddit.models.js';

const QUERY_URL = process.env.QUERY_URL!;
const REDDIT_SAVED_URL = (username: string) => `https://oauth.reddit.com/user/${username}/saved?limit=100&raw_json=1`;

export function mkFetchAndSend(logger: ILogger, fetchDependency: (arg: Request) => Promise<Response>) {
    return async (jwt: string, username: string) => {
        logger.info(`Started fetching and sending saved posts from Reddit API`);
        let after = '';
        while (after !== null) {
            logger.info(`Fetching batch of posts after=${after} from Reddit API`);
            const response = await fetchDependency(new Request(REDDIT_SAVED_URL(username) + `&after=${after}`, {
                headers: {
                    'Authorization': jwt
                }
            }));
            const json = await response.json() as RedditResponse;
            const posts = json.data.children;
            logger.info(`Sending batch of posts after=${after} to Query Service`);
            await fetchDependency(new Request(`${QUERY_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': jwt
                },
                body: JSON.stringify(posts)
            }));
            after = json.data.after;
        }
        logger.info(`Finished fetching and sending saved posts from Reddit API`);
    }
}

export async function fetchAllPosts(logger: ILogger, username: string, jwt: string) {
    logger.info(`Started fetching saved posts from Reddit API`);
    let after = '';
    while (after !== null) {
        after = await fetchBatchPosts(logger, jwt, username, after);
    }
    logger.info(`Finished fetching saved posts from Reddit API`);
}

async function fetchBatchPosts(logger: ILogger, jwt: string, username: string, after: string): Promise<string> {
    const response = await fetch(REDDIT_SAVED_URL(username) + `&after=${after}`, {
        headers: {
            'Authorization': jwt
        }
    });
    if (!response.ok) {
        throw new Error(`Unknown response ${response.status} from Reddit /saved endpoint`);
    }
    logger.http(`Fetched batch of posts starting with ${after} from Reddit API`);
    const json = await response.json() as RedditResponse;

    // send
    // await fetch(`${QUERY_URL}/posts`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(json)
    // });

    return json.data.after;
}