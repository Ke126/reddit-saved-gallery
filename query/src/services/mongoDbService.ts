import type { ILogger } from '../shared/loggerModel.js';
import 'dotenv/config';
import type { RedditThing, RedditThingDoc, Subreddit, UserDoc, JoinedDoc, ReadResult } from '../models/mongoDbModel.js';
import type { IMongoDbService } from './mongoDbServiceModel.js';
import { AnyBulkWriteOperation, Collection, MongoClient } from 'mongodb';
import type { QueryParams } from '../models/queryModel.js';

export function makeMongoDbService(logger: ILogger): IMongoDbService {
    const MONGO_STRING = process.env.MONGO_STRING!;
    const DB_NAME = process.env.DB_NAME!;
    const POSTS_COLLECTION_NAME = process.env.POSTS_COLLECTION_NAME!;
    const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME!;

    let postsCollection: Collection<RedditThingDoc>;
    let usersCollection: Collection<UserDoc>;

    return {
        async connect() {
            const client = new MongoClient(MONGO_STRING);
            await client.connect();
            const db = client.db(DB_NAME);
            postsCollection = db.collection(POSTS_COLLECTION_NAME);
            usersCollection = db.collection(USERS_COLLECTION_NAME);
            logger.info('Connected to MongoDB');
        },
        async readPosts(user: string, query: QueryParams): Promise<ReadResult> {
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
            logger.info(`Read ${output.count}/${output.total_count} posts for user ${user}`);
            return output;
        },
        async upsertPosts(user: string, posts: RedditThing[], timestamp: number): Promise<void> {
            const bulkPostOps: AnyBulkWriteOperation<RedditThingDoc>[] = posts.map(post => ({
                updateOne: {
                    filter: { _id: post.data.name },
                    update: { $set: post },
                    upsert: true,
                },
            }));
            const upsertOp: AnyBulkWriteOperation<UserDoc> = { updateOne: { filter: { _id: user }, update: { $setOnInsert: { posts: [] } }, upsert: true } };
            const bulkUserOps: AnyBulkWriteOperation<UserDoc>[] = [upsertOp].concat(posts.map(post => ({
                updateOne: {
                    filter: { _id: user },
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
            await postsCollection.bulkWrite(bulkPostOps, { ordered: false });
            await usersCollection.bulkWrite(bulkUserOps, { ordered: false });
            logger.info(`Upserted ${posts.length} posts in posts collection`);
            logger.info(`Upserted ${posts.length} posts for user ${user} in users collection`);
        },
        async pinPost(user: string, id: string): Promise<void> {
            await usersCollection.updateOne({ _id: user }, {
                $set: {
                    'posts.$[post].pinned': true
                }
            }, { arrayFilters: [{ 'post.post_id': id }] });
            logger.info(`Pinned post ${id} for user ${user}`);
        },
        async unpinPost(user: string, id: string): Promise<void> {
            await usersCollection.updateOne({ _id: user }, [{
                $set: {
                    posts: {
                        $cond: {
                            if: {
                                "$in": [
                                    `${id}`,
                                    "$posts.post_id"
                                ]
                            },
                            then: "$posts",
                            else: {
                                "$concatArrays": [
                                    [
                                        { post_id: id, saved_at: Date.now(), pinned: false } // dec. timestamp so lower posts are less recent
                                    ],
                                    "$posts"
                                ]
                            }
                        }
                    }
                },
            }], { arrayFilters: [{ 'post.post_id': id }] });
            logger.info(`Unpinned post ${id} for user ${user}`);
        },
        async savePost(user: string, id: string): Promise<void> {
            await usersCollection.updateOne({ _id: user }, {
                $set: {
                    $cond: {

                    }
                }
            });
            logger.info(`Saved post ${id} for user ${user}`);
        },
        async unsavePost(user: string, id: string): Promise<void> {
            await usersCollection.updateOne({ _id: user }, {
                $pull: { posts: { post_id: id } }
            });
            logger.info(`Unsaved post ${id} for user ${user}`);
        },
        async readSubreddits(user: string): Promise<Subreddit[]> {
            const result = await usersCollection.aggregate<Subreddit>([
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
                    $group: {
                        _id: "$data.subreddit",
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        subreddit: "$_id",
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
            logger.info(`Read ${result.length} subreddits for user ${user}`);
            return result;
        }
    }
}