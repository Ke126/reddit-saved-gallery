import { ObjectId, MongoClient, Collection, Filter, Db, Sort, SortDirection, AnyBulkWriteOperation } from 'mongodb';
import { posts } from './posts.js';

const MONGO_URL = 'mongodb://localhost:27017'
const DB_NAME = 'test_db'
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';

interface UserDoc {
    _id: string,
    posts: {
        post_id: string,
        timestamp: number
    }[]
}

interface RedditPostDoc {
    _id: string,
    kind: string,
    data: {
        name: string,
        text: string
    },
}

const client = new MongoClient(MONGO_URL);
await client.connect();
const db = client.db(DB_NAME);
const postsCollection = db.collection<RedditPostDoc>(POSTS_COLLECTION_NAME);
const usersCollection = db.collection<UserDoc>(USERS_COLLECTION_NAME);
console.log("Connected to MongoDB");

const bulkPostOps: AnyBulkWriteOperation<RedditPostDoc>[] = posts.map(post => ({
    updateOne: {
        filter: { _id: post.data.name }, // Query to find existing document
        update: { $set: post }, // Set fields if inserting a new document
        upsert: true, // Upsert: insert if not found, update if found
    },
}));

let timestamp = 100;
const name = 'TEST';

const bulkUserOps: AnyBulkWriteOperation<UserDoc>[] = posts.map(post => ({
    updateOne: {
        filter: { _id: post.data.name }, // Query to find existing document
        update: { $addToSet: { posts: { post_id: post.data.name, timestamp: ++timestamp } } }, // Set fields if inserting a new document
        arrayFilters: [{}],
        upsert: true, // Upsert: insert if not found, update if found
    },
}));

const bulkUserOps2: AnyBulkWriteOperation<UserDoc>[] = [{ updateOne: { filter: { _id: name }, update: { $setOnInsert: { posts: [] } }, upsert: true } }, ...posts.map(post => ({
    updateOne: {
        filter: { _id: name }, // Query to find existing document
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
                                        { post_id: post.data.name, timestamp: 265256235235 }
                                    ],
                                    "$posts"
                                ]
                            }
                        }
                    }
                },
            }
        ],
        upsert: true,
    },
}))];

const upsertOp: AnyBulkWriteOperation<UserDoc> = { updateOne: { filter: { _id: name }, update: { $setOnInsert: { posts: [] } }, upsert: true } };
const bulkUserOps3: AnyBulkWriteOperation<UserDoc>[] = [upsertOp].concat(posts.map(post => ({
    updateOne: {
        filter: { _id: name }, // Query to find existing document
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
                                        { post_id: post.data.name, timestamp: 6 }
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

console.log(await usersCollection.bulkWrite(bulkUserOps3, { ordered: false }));

// console.log(await usersCollection.updateOne(
//     { _id: "TEST" },
//     [
//         {
//             $set: {
//                 posts: {
//                     $cond: {
//                         if: { $isArray: "$posts" }, // Check if posts is an array
//                         then: {
//                             $cond: {
//                                 if: { $in: ["10", "$posts.post_id"] },
//                                 then: "$posts",
//                                 else: {
//                                     $concatArrays: [
//                                         [{ post_id: "10", timestamp: 1 }],
//                                         "$posts",
//                                     ],
//                                 },
//                             },
//                         },
//                         else: [], // Initialize posts as an array
//                     },
//                 },
//             },
//         },
//     ],
//     { upsert: true }
// ));

// await postsCollection.bulkWrite(bulkPostOps, { ordered: false });

console.log("done");