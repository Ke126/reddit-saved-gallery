import type { ILogger } from '../shared/loggerModel.js';
import 'dotenv/config';
import type { RedditListing } from '../models/redditModel.js';
import type { IRedditApiService } from './redditApiServiceModel.js';

const QUERY_URL = process.env.QUERY_URL!;
const REDDIT_SAVED_URL = (username: string) => `https://oauth.reddit.com/user/${username}/saved?limit=100&raw_json=1`;
const REDDIT_SAVE_URL = 'https://oauth.reddit.com/api/save?';
const REDDIT_UNSAVE_URL = 'https://oauth.reddit.com/api/unsave?';

export function makeRedditApiService(logger: ILogger, fetch: (req: Request) => Promise<Response>): IRedditApiService {
    return {
        async pullSavedPosts(jwt: string, username: string) {
            logger.info(`Started pulling saved posts from Reddit`);
            let timestamp = Date.now();
            let after: string | null = '';
            let total = 0;
            while (after !== null) {
                const response = await fetch(new Request(REDDIT_SAVED_URL(username) + `&after=${after}`, {
                    headers: {
                        'Authorization': jwt,
                        'Content-Type': 'application/json'
                    }
                }));
                const json = await response.json() as RedditListing;
                logger.info(`Fetched ${json.data.dist} posts after=${after} from Reddit`);
                const posts = json.data.children;
                await fetch(new Request(`${QUERY_URL}/posts`, {
                    method: 'POST',
                    headers: {
                        'Authorization': jwt,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ timestamp: timestamp, posts: posts })
                }));
                logger.info(`Sent ${json.data.dist} posts after=${after} to Query Service`);
                timestamp -= json.data.dist;
                total += json.data.dist;
                after = json.data.after;
            }
            logger.info(`Finished pulling ${total} saved posts from Reddit`);
        },
        async savePost(jwt: string, id: string) {
            await fetch(new Request(REDDIT_SAVE_URL + `id=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json'
                }
            }));
            logger.info(`Saved ${id}`);
        },
        async unsavePost(jwt: string, id: string) {
            await fetch(new Request(REDDIT_UNSAVE_URL + `id=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json'
                }
            }));
            logger.info(`Unsaved ${id}`);
        }
    }
}