import { ObjectId, MongoClient, Collection, Filter, Db, Sort, SortDirection } from 'mongodb';
import 'dotenv/config';
import type { ILogger } from '../shared/logger.models.js';
import type { FavoriteRequest, QueryRequest } from '../models/query.models.js';
import type { RedditPostDoc, UserDoc } from '../models/mongo.models.js';
import { parseJWT, parseQuery } from './parse.js';
import { RedditPost } from '../shared/reddit.models.js';

const MONGO_URL = process.env.MONGO_URL!;
const DB_NAME = process.env.DB_NAME!;
const POSTS_COLLECTION_NAME = process.env.POSTS_COLLECTION_NAME!;
const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME!;

let postsCollection: Collection<RedditPostDoc>;
let usersCollection: Collection<UserDoc>;

export function initializeDatabase(logger: ILogger) {
    return async () => {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        const db = client.db(DB_NAME);
        postsCollection = db.collection<RedditPostDoc>(POSTS_COLLECTION_NAME);
        usersCollection = db.collection<UserDoc>(USERS_COLLECTION_NAME);
        logger.info('Connected to MongoDB');
    }
}

export function readPosts(logger: ILogger, getUsersPosts: (user: string) => Promise<string[]>, getPosts: (posts: string[], query: QueryRequest) => Promise<RedditPostDoc[]>) {
    return async (jwt: string, query: qs.ParsedQs) => {
        const userStr = parseJWT(jwt);
        const queryObj = parseQuery(query);
        const posts = await getUsersPosts(userStr);
        if (posts.length === 0) return [];

        const postDocs = await getPosts(posts, queryObj);
        return postDocs;
    }
}

async function getUsersPosts(logger: ILogger, user: string) {
    const result = await usersCollection.aggregate<{ _id: string, post_ids: string[] }>([
        {
            $match: {
                _id: user
            }
        },
        {
            "$unwind": "$posts"
        },
        {
            $sort: {
                "posts.favorited": -1,
                "posts.saved_at": -1
            }
        },
        {
            $group: {
                _id: "$_id",
                post_ids: {
                    $push: "$posts.post_id"
                }
            }
        }
    ]).toArray();
    const postIds = result[0].post_ids;
    logger.info(`Found ${postIds.length} total saved posts for user ${user}`);
    return postIds;
}

async function getPosts(logger: ILogger, posts: string[], query: QueryRequest) {
    const limit = 100;
    const skip = (query.page - 1) * limit;
    const searchRegex = new RegExp(query.q, 'i');
    const result = await postsCollection.aggregate<{ count: { count: number }[], posts: RedditPostDoc[] }>([
        {
            $match: {
                _id: { $in: posts }, // posts saved by user
                $or: [
                    { 'data.subreddit': { $regex: searchRegex } },
                    { 'data.title': { $regex: searchRegex } },
                    { 'data.selftext': { $regex: searchRegex } }
                ], // posts matching search
                ...(query.include ? { 'data.subreddit': { $in: query.include } } : {}), // conditional include
                ...(query.exclude ? { 'data.subreddit': { $nin: query.exclude } } : {}), // conditional exclude

            }
        },
        {
            $facet: {
                posts: [
                    {
                        $addFields: {
                            __order: {
                                $indexOfArray: [
                                    posts,
                                    "$key"
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            __order: 1
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },
                    {
                        $project: {
                            __order: 0
                        }
                    }
                ],
                count: [
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ]).toArray();
    const output = {
        count: result[0].posts.length,
        total_count: result[0].count[0].count,
        posts: result[0].posts
    };
    logger.info(`Found ${output.total_count} saved posts matching query, retrieved ${output.count}`);
    return output;
}

export function insertPosts(logger: ILogger, insertToUser: (user: string, posts: RedditPost[]) => Promise<void>, insertToPosts: (posts: RedditPost[]) => Promise<void>) {
    return async (jwt: string, posts: RedditPost[]) => {
        const userStr = parseJWT(jwt);
        await insertToUser(userStr, posts);
        await insertToPosts(posts);
    }
}

async function insertToUser(user: string, posts: RedditPost[]) {
    
}

export function favoritePost(logger: ILogger, favoriteToUser: (user: string, favorite: FavoriteRequest) => Promise<void>) {
    return async (jwt: string, favorite: FavoriteRequest) => {
        const userStr = parseJWT(jwt);
        await favoriteToUser(userStr, favorite);
    }
}

export function readSubreddits() {

}

export async function getUser(logger: ILogger, user: string): Promise<UserDoc | null> {
    const userDoc = await usersCollection.findOne<UserDoc>({ user: user });
    logger.info(`Read user ${user} from MongoDB`);
    return userDoc;
}

export async function raeadPosts(query: qs.ParsedQs) {
    const db = client.db(DB_NAME);
    const collection = db.collection(collectionName);
    // initialize query strings
    const q = query.q || '';
    const type = query.type || '';
    const subreddits = (query.subreddits || '').split(',');
    // case-insensitive search regex
    const searchRegex = new RegExp(q, 'i');
    // check for q matches in title, subreddit, or selftext
    // use inclusive/exclusive subreddit query based on query type
    // sort by favorites in order of favorited -> not favorited
    const documents = await collection.find({
        $or: [
            { title: { $regex: searchRegex } },
            { subreddit: { $regex: searchRegex } },
            { selftext: { $regex: searchRegex } }
        ],
        subreddit: type === 'inclusive' ? { $in: subreddits } : { $nin: subreddits }
    }).sort({ favorite: -1 }).toArray();
    logger.info(`(${process.pid}) Query Service read ${documents.length} documents from MongoDB`);
    return documents;
}

export async function insertPosts(newPosts: models.RedditPost[]) {
    // format the incoming data to be put into mongodb
    const documents = newPosts.map(({ name, title, subreddit_name_prefixed, url_overridden_by_dest, thumbnail, selftext, permalink }) => ({
        _id: name,
        title,
        subreddit: subreddit_name_prefixed,
        selftext,
        permalink: "https://reddit.com" + permalink,
        // add these properties
        favorite: false,
        ...hasImage(url_overridden_by_dest || '', thumbnail || '')
    }));
    // map to an array of updateOne operations with upsert: true
    const operations: any = documents.map(doc => ({
        updateOne: {
            filter: { _id: doc._id },
            update: { $setOnInsert: doc },
            upsert: true
        }
    }));
    const db = client.db(DB_NAME);
    const collection = db.collection(collectionName);
    // ordered: false allows failed inserts (due to duplicate _ids) to be skipped
    // this way only new _ids will be inserted, and existing _ids will be skipped
    const result = await collection.bulkWrite(operations, { ordered: false });
    logger.info(`(${process.pid}) Query Service performed bulkWrite to MongoDB with result ${result}`);
}

export async function favoritePost(id: string, favorite: boolean) {
    const db = client.db(DB_NAME);
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { favorite: favorite } }
    );
    logger.info(`(${process.pid}) Query Service set ${id} favorite to ${favorite} in MongoDB`);
}

export async function countSubreddits() {
    const db = client.db(DB_NAME);
    const collection = db.collection(collectionName);
    const aggregationPipeline = [
        {
            $group: {
                _id: '$subreddit',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                subreddit: '$_id',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ];
    const result = await collection.aggregate(aggregationPipeline).toArray();
    console.log(result);
    return result;
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