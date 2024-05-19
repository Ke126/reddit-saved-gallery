import { AnyBulkWriteOperation, Collection, MongoClient } from "mongodb";
import { JoinedDoc, RedditPostDoc, UserDoc } from "../models/mongo.models.js";
import { PinRequest, QueryRequest } from "../models/query.models.js";
import { ILogger } from "../shared/logger.models.js";
import { RedditPost } from "../shared/reddit.models.js";

const MONGO_STRING = process.env.MONGO_STRING!;
const DB_NAME = process.env.DB_NAME!;
const POSTS_COLLECTION_NAME = process.env.POSTS_COLLECTION_NAME!;
const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME!;

let postsCollection: Collection<RedditPostDoc>;
let usersCollection: Collection<UserDoc>;

export function initializeDatabase(logger: ILogger) {
    return async () => {
        const client = new MongoClient(MONGO_STRING);
        await client.connect();
        const db = client.db(DB_NAME);
        postsCollection = db.collection<RedditPostDoc>(POSTS_COLLECTION_NAME);
        usersCollection = db.collection<UserDoc>(USERS_COLLECTION_NAME);
        logger.info('Connected to MongoDB');
    }
}

export async function getUsersPosts2(logger: ILogger, user: string, query: QueryRequest) {
    const limit = 100;
    const skip = (query.page - 1) * limit;
    const searchRegex = new RegExp(query.q.replace(/([()[{*+.$^\\|?])/g, '\\$1'), 'i');
    const result = await usersCollection.aggregate<{ posts: JoinedDoc[], total_count: { count: number }[] }>([
        {
            $match: {
                _id: user
            }
        },
        {
            $unwind: "$posts"
        },
        {
            $replaceWith: "$posts"
        },
        {
            $set: {
                _id: "$post_id",
                post_id: "$$REMOVE"
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "_id",
                as: "post"
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            $arrayElemAt: [
                                "$post",
                                0
                            ]
                        },
                        "$$ROOT"
                    ]
                }
            }
        },
        {
            $project: {
                post: 0
            }
        },
        {
            $match: {
                ...(query.q.length > 0 ? {
                    $or: [
                        { 'data.subreddit': { $regex: searchRegex } },
                        { 'data.title': { $regex: searchRegex } },
                        { 'data.selftext': { $regex: searchRegex } },
                        { 'data.author': { $regex: searchRegex } }
                    ],
                } : {}), // search
                ...(query.in ? { 'data.subreddit': { $in: query.in } } : {}), // conditional include
                ...(query.nin ? { 'data.subreddit': { $nin: query.nin } } : {}), // conditional exclude
            }
        },
        {
            $facet: {
                posts: [
                    {
                        $sort: {
                            pinned: -1,
                            saved_at: -1
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    },
                ],
                total_count: [
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ]).toArray();
    const output = {
        total_count: result[0].total_count[0] ? result[0].total_count[0].count : 0,
        count: result[0].posts.length,
        page: query.page,
        posts: result[0].posts
    };
    logger.info(`Found ${output.total_count} saved posts matching query for user ${user}, retrieved ${output.count} from posts collection`);
    return output;
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
                "posts.pinned": -1,
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
    if (result.length === 0) {
        logger.info(`Found 0 total saved posts for user ${user} from users collection`);
        return []
    }
    const postIds = result[0].post_ids;
    logger.info(`Found ${postIds.length} total saved posts for user ${user} from users collection`);
    return postIds;
}

export async function getPosts(logger: ILogger, posts: string[], query: QueryRequest) {
    const limit = 100;
    const skip = (query.page - 1) * limit;
    const searchRegex = new RegExp(query.q, 'i');
    const result = await postsCollection.aggregate<{ posts: RedditPostDoc[], total_count: { count: number }[] }>([
        {
            $match: {
                _id: { $in: posts }, // posts saved by user
                $or: [
                    { 'data.subreddit': { $regex: searchRegex } },
                    { 'data.title': { $regex: searchRegex } },
                    { 'data.selftext': { $regex: searchRegex } }
                ], // posts matching search
                ...(query.in ? { 'data.subreddit': { $in: query.in } } : {}), // conditional include
                ...(query.nin ? { 'data.subreddit': { $nin: query.nin } } : {}), // conditional exclude

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
                                    "$_id"
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
                total_count: [
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ]).toArray();
    const output = {
        total_count: result[0].total_count[0] ? result[0].total_count[0].count : 0,
        count: result[0].posts.length,
        page: query.page,
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
        },
        {
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
                                            { post_id: post.data.name, saved_at: timestamp--, pinned: false } // dec. timestamp so lower posts are less recent
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

export async function pinToUser(logger: ILogger, user: string, pinRequest: PinRequest) {
    await usersCollection.updateOne({ _id: user }, {
        $set: {
            'posts.$[post].pinned': pinRequest.pinned
        }
    }, { arrayFilters: [{ 'post.post_id': pinRequest._id }] });
    logger.info(`Set post ${pinRequest._id} pinned=${pinRequest.pinned} for user ${user}`);
}