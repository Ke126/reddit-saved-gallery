import 'dotenv/config';
import type { ILogger } from '../shared/logger.models.js';
import type { FavoriteRequest, QueryRequest } from '../models/query.models.js';
import type { RedditPostDoc, UserDoc } from '../models/mongo.models.js';
import { parseJWT, parseQuery } from './parse.js';
import { RedditPost } from '../shared/reddit.models.js';

export function readPosts(logger: ILogger, getUsersPosts: (user: string) => Promise<string[]>, getPosts: (posts: string[], query: QueryRequest) => Promise<{ count: number, total_count: number, posts: RedditPostDoc[] }>) {
    return async (jwt: string, query: qs.ParsedQs) => {
        const userStr = parseJWT(jwt);
        const queryObj = parseQuery(query);
        const posts = await getUsersPosts(userStr);
        if (posts.length === 0) {
            logger.info(`Read 0 posts for user ${userStr}`);
            return { count: 0, total_count: 0, posts: [] };
        }
        const postDocs = await getPosts(posts, queryObj);
        logger.info(`Read ${postDocs.count} posts for user ${userStr}`);
        return postDocs;
    }
}

export function insertPosts(logger: ILogger, insertToUser: (user: string, timestamp: number, posts: RedditPost[]) => Promise<void>, insertToPosts: (posts: RedditPost[]) => Promise<void>) {
    return async (jwt: string, timestamp: number, posts: RedditPost[]) => {
        const userStr = parseJWT(jwt);
        await insertToUser(userStr, timestamp, posts);
        await insertToPosts(posts);
        logger.info(`Upserted ${posts.length} posts for user ${userStr}`);
    }
}

export function favoritePost(logger: ILogger, favoriteToUser: (user: string, favorite: FavoriteRequest) => Promise<void>) {
    return async (jwt: string, favorite: FavoriteRequest) => {
        const userStr = parseJWT(jwt);
        await favoriteToUser(userStr, favorite);
    }
}

export function readSubreddits(logger: ILogger, getUsersPosts: (user: string) => Promise<string[]>, getSubreddits: (posts: string[]) => Promise<{ subreddit: string, count: number }[]>) {
    return async (jwt: string) => {
        const userStr = parseJWT(jwt);
        const posts = await getUsersPosts(userStr);
        if (posts.length === 0) {
            logger.info(`Read 0 unique subreddits for user ${userStr}`);
            return [];
        }
        const subreddits = await getSubreddits(posts);
        logger.info(`Read ${subreddits.length} unique subreddits for user ${userStr}`);
        return subreddits;
    }
}

// check url_overridden_by_dest first, then thumbnail for a valid image to display
function hasImage(url_overridden_by_dest: string, thumbnail: string) {
    const obj = {
        has_image: false,
        image_link: 'none'
    };
    const formats = ['.png', '.jpg', '.jpeg', '.gif'];
    // prefer url_overridden_by_dest (full res image) over thumbnail
    if (formats.some(format => url_overridden_by_dest.toLowerCase().includes(format))) {
        obj.has_image = true;
        obj.image_link = url_overridden_by_dest;
    }
    else if (formats.some(format => thumbnail.toLowerCase().includes(format))) {
        obj.has_image = true;
        obj.image_link = thumbnail;
    }
    return obj;
}