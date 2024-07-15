import type { ILogger } from '../shared/loggerModel.js';
import type { RedditListing } from '../models/redditModel.js';
import type { IRedditApiService } from './redditApiServiceModel.js';

const QUERY_URL = `http://query:${process.env.QUERY_PORT || 4001}`;
const REDDIT_SAVED_URL = (username: string) => `https://oauth.reddit.com/user/${username}/saved?limit=100&raw_json=1`;
const REDDIT_SAVE_URL = 'https://oauth.reddit.com/api/save?';
const REDDIT_UNSAVE_URL = 'https://oauth.reddit.com/api/unsave?';

export class RedditApiService implements IRedditApiService {
    private logger: ILogger;
    private fetch: typeof fetch;
    constructor(logger: ILogger, fetchFunc: typeof fetch) {
        this.logger = logger;
        this.fetch = fetchFunc;
    }
    async pullSavedPosts(jwt: string, username: string) {
        this.logger.info(`Started pulling saved posts from Reddit`);
        let timestamp = Date.now();
        let after: string | null = '';
        let total = 0;
        while (after !== null) {
            const response = await this.fetch(new Request(REDDIT_SAVED_URL(username) + `&after=${after}`, {
                headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json'
                }
            }));
            const json = await response.json() as RedditListing;
            this.logger.info(`Fetched ${json.data.dist} posts after=${after} from Reddit`);
            const posts = json.data.children;
            await fetch(new Request(`${QUERY_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': jwt,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ timestamp: timestamp, posts: posts })
            }));
            this.logger.info(`Sent ${json.data.dist} posts after=${after} to Query Service`);
            timestamp -= json.data.dist;
            total += json.data.dist;
            after = json.data.after;
        }
        this.logger.info(`Finished pulling ${total} saved posts from Reddit`);
    }
    async savePost(jwt: string, id: string) {
        await this.fetch(new Request(REDDIT_SAVE_URL + `id=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': jwt,
                'Content-Type': 'application/json'
            }
        }));
        this.logger.info(`Saved ${id}`);
    }
    async unsavePost(jwt: string, id: string) {
        await this.fetch(new Request(REDDIT_UNSAVE_URL + `id=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': jwt,
                'Content-Type': 'application/json'
            }
        }));
        this.logger.info(`Unsaved ${id}`);
    }
}
