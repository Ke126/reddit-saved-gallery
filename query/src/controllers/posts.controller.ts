import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from '../shared/logger.models.js'
import 'dotenv/config';
import qs from "qs";
import { RedditPostDoc } from "../models/mongo.models.js";
import { RedditPost } from "../shared/reddit.models.js";
import { PinRequest } from "../models/query.models.js";

const QUERY_URL = process.env.QUERY_URL!;
const REDDIT_URL = process.env.REDDIT_URL!;

export const controller = {
    // QUERY
    get(logger: ILogger, dbDependency: (jwt: string, query: qs.ParsedQs) => Promise<{ count: number, total_count: number, posts: RedditPostDoc[] }>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                const posts = await dbDependency(req.headers.authorization!, req.query);
                logger.info(`Successful completion with status code 200`);
                res.status(200).json(posts);
            }
            catch (err) {
                next(err);
            }
        }
    },
    // REDDIT -> QUERY
    post(logger: ILogger, dbDependency: (jwt: string, timestamp: number, posts: RedditPost[]) => Promise<void>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                await dbDependency(req.headers.authorization!, req.body.timestamp, req.body.posts)
                logger.info(`Successful completion with status code 201`);
                res.status(201).json({ status: 201 });
            }
            catch (err) {
                next(err);
            }
        }
    },
    // QUERY
    // REDDIT -> QUERY
    patch(logger: ILogger, dbDependency: (jwt: string, pin: PinRequest) => Promise<void>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                await dbDependency(req.headers.authorization!, { _id: req.params.id, pinned: req.body.pinned });
                logger.info(`Successful completion with status code 200`);
                res.status(200).json({ status: 200 });
            }
            catch (err) {
                next(err);
            }
        }
    },
    // // REDDIT -> QUERY
    // delete() { }
}