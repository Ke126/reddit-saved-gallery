import 'dotenv/config';
import type { ILogger } from '../shared/logger.models.js';
import type { FavoriteRequest, QueryRequest } from '../models/query.models.js';
import type { RedditPostDoc, UserDoc } from '../models/mongo.models.js';
import { parseJWT, parseQuery } from './parse.js';
import { RedditPost } from '../shared/reddit.models.js';

export function readPosts(logger: ILogger, getUsersPosts: (user: string) => Promise<string[]>, getPosts: (posts: string[], query: QueryRequest) => Promise<RedditPostDoc[]>) {
    return async (jwt: string, query: qs.ParsedQs) => {
        const userStr = parseJWT(jwt);
        const queryObj = parseQuery(query);
        const posts = await getUsersPosts(userStr);
        logger.info(`Read ${posts.length} posts for user ${userStr}`);
        if (posts.length === 0) return [];

        const postDocs = await getPosts(posts, queryObj);
        return postDocs;
    }
}

export function insertPosts(logger: ILogger, insertToUser: (user: string, posts: RedditPost[]) => Promise<void>, insertToPosts: (posts: RedditPost[]) => Promise<void>) {
    return async (jwt: string, posts: RedditPost[]) => {
        const userStr = parseJWT(jwt);
        await insertToUser(userStr, posts);
        await insertToPosts(posts);
    }
}

export function favoritePost(logger: ILogger, favoriteToUser: (user: string, favorite: FavoriteRequest) => Promise<void>) {
    return async (jwt: string, favorite: FavoriteRequest) => {
        const userStr = parseJWT(jwt);
        await favoriteToUser(userStr, favorite);
    }
}

export function readSubreddits(logger: ILogger, getUsersPosts: (user: string) => Promise<string[]>, getSubreddits: (posts: string[]) => Promise<RedditPostDoc[]>) {
    return async (jwt: string) => {
        const userStr = parseJWT(jwt);
        const posts = await getUsersPosts(userStr);
        logger.info(`Read ${posts.length} posts for user ${userStr}`);
        if (posts.length === 0) return [];
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