import type { QueryParams } from '../models/queryModel.js';
import type {
    RedditThing,
    ReadResult,
    Subreddit,
} from '../models/mongoDbModel.js';

export interface IMongoDbService {
    connect(): Promise<void>;

    readPosts(user: string, query: QueryParams): Promise<ReadResult>;
    upsertPosts(
        user: string,
        posts: RedditThing[],
        timestamp: number,
    ): Promise<void>;
    pinPost(user: string, id: string): Promise<void>;
    unpinPost(user: string, id: string): Promise<void>;
    savePost(user: string, id: string): Promise<void>;
    unsavePost(user: string, id: string): Promise<void>;

    readSubreddits(user: string): Promise<Subreddit[]>;
}
