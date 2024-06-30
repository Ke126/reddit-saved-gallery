import type { ILogger } from '../shared/loggerModel.js';
import type { RedditThing, RedditThingDoc, Subreddit, UserDoc, JoinedDoc, ReadResult } from '../models/mongoDbModel.js';
import type { IMongoDbService } from './mongoDbServiceModel.js';
import { AnyBulkWriteOperation, Collection, MongoClient } from 'mongodb';
import type { QueryParams } from '../models/queryModel.js';
import { getMongoPassword, getMongoUsername } from '../utils/secrets.js';

export class MongoDbService implements IMongoDbService {
    private logger: ILogger;
    private postsCollection!: Collection<RedditThingDoc>;
    private usersCollection!: Collection<UserDoc>;

    constructor(logger: ILogger) {
        this.logger = logger;
    }
    async connect() {
        const connectionString = `mongodb://${await getMongoUsername()}:${await getMongoPassword()}@mongo:${process.env.MONGO_PORT}`
        const client = new MongoClient(connectionString);
        await client.connect();
        const db = client.db(process.env.DB_NAME!);
        this.postsCollection = db.collection(process.env.POSTS_COLLECTION_NAME!);
        this.usersCollection = db.collection(process.env.USERS_COLLECTION_NAME!);
        this.logger.info('Connected to MongoDB');
    }
    async readPosts(user: string, query: QueryParams): Promise<ReadResult> {
        const limit = 100;
        const skip = (query.page - 1) * limit;
        const searchRegex = new RegExp(query.q.replace(/([()[{*+.$^\\|?])/g, '\\$1'), 'i');
        const result = await this.usersCollection.aggregate<{ posts: JoinedDoc[], total_count: { count: number }[] }>([
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
        this.logger.info(`Read ${output.count}/${output.total_count} posts for user ${user}`);
        return output;
    }
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
        await this.postsCollection.bulkWrite(bulkPostOps, { ordered: false });
        await this.usersCollection.bulkWrite(bulkUserOps, { ordered: false });
        this.logger.info(`Upserted ${posts.length} posts in posts collection`);
        this.logger.info(`Upserted ${posts.length} posts for user ${user} in users collection`);
    }
    async pinPost(user: string, id: string): Promise<void> {
        await this.usersCollection.updateOne({ _id: user }, {
            $set: {
                'posts.$[post].pinned': true
            }
        }, { arrayFilters: [{ 'post.post_id': id }] });
        this.logger.info(`Pinned post ${id} for user ${user}`);
    }
    async unpinPost(user: string, id: string): Promise<void> {
        await this.usersCollection.updateOne({ _id: user }, {
            $set: {
                'posts.$[post].pinned': false
            }
        }, { arrayFilters: [{ 'post.post_id': id }] });
        this.logger.info(`Unpinned post ${id} for user ${user}`);
    }
    async savePost(user: string, id: string): Promise<void> {
        await this.usersCollection.updateOne({ _id: user }, [{
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
        }]);
        this.logger.info(`Saved post ${id} for user ${user}`);
    }
    async unsavePost(user: string, id: string): Promise<void> {
        await this.usersCollection.updateOne({ _id: user }, {
            $pull: { posts: { post_id: id } }
        });
        this.logger.info(`Unsaved post ${id} for user ${user}`);
    }
    async readSubreddits(user: string): Promise<Subreddit[]> {
        const result = await this.usersCollection.aggregate<Subreddit>([
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
        this.logger.info(`Read ${result.length} subreddits for user ${user}`);
        return result;
    }
}
