import { AnyBulkWriteOperation, Collection, MongoClient } from "mongodb";
import { RedditPostDoc, UserDoc } from "../models/mongo.models.js";
import { FavoriteRequest, QueryRequest } from "../models/query.models.js";
import { ILogger } from "../shared/logger.models.js";
import { RedditPost } from "../shared/reddit.models.js";

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

export async function getUsersPosts(logger: ILogger, user: string) {
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
    logger.info(`Found ${postIds.length} total saved posts for user ${user} from users collection`);
    return postIds;
}

export async function getPosts(logger: ILogger, posts: string[], query: QueryRequest) {
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
    logger.info(`Found ${output.total_count} saved posts matching query, retrieved ${output.count} from posts collection`);
    return output;
}

export async function getSubreddits(logger: ILogger, posts: string[]) {
    const result = await postsCollection.aggregate<{ subreddit: string, count: number }>([
        {
            $match: {
                _id: {
                    $in: posts
                }
            },
            $group: {
                _id: '$data.subreddit',
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
                count: -1,
                subreddit: 1
            }
        }
    ]).toArray();
    logger.info(`Found ${result.length} unique subreddits from posts collection`);
    return result;
}

export async function insertToUser(logger: ILogger, user: string, timestamp: number, posts: RedditPost[]) {
    const upsertOp: AnyBulkWriteOperation<UserDoc> = { updateOne: { filter: { _id: user }, update: { $setOnInsert: { posts: [] } }, upsert: true } };
    const bulkUserOps: AnyBulkWriteOperation<UserDoc>[] = [upsertOp].concat(posts.map(post => ({
        updateOne: {
            filter: { _id: user }, // Query to find existing document
            update: [
                {
                    $set: {
                        posts: {
                            $cond: {
                                if: {
                                    "$in": [
                                        `${post.data.name}`,
                                        "$posts.post_id"
                                    ]
                                },
                                then: "$posts",
                                else: {
                                    "$concatArrays": [
                                        [
                                            { post_id: post.data.name, timestamp: timestamp-- } // dec. so lower posts are less recent
                                        ],
                                        "$posts"
                                    ]
                                }
                            }
                        }
                    },
                }
            ]
        },
    })));
    await usersCollection.bulkWrite(bulkUserOps, { ordered: false });
    logger.info(`Upserted ${posts.length} posts for user ${user} in users collection`);
}

export async function insertToPosts(logger: ILogger, posts: RedditPost[]) {
    const bulkPostOps: AnyBulkWriteOperation<RedditPostDoc>[] = posts.map(post => ({
        updateOne: {
            filter: { _id: post.data.name }, // Query to find existing document
            update: { $set: post }, // Set fields if inserting a new document
            upsert: true, // Upsert: insert if not found, update if found
        },
    }));
    await postsCollection.bulkWrite(bulkPostOps, { ordered: false });
    logger.info(`Upserted ${posts.length} posts in posts collection`);
}

export async function favoriteToUser(logger: ILogger, user: string, favoriteRequest: FavoriteRequest) {

}