import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from '../shared/logger.models.js';
import 'dotenv/config';

const QUERY_URL = process.env.QUERY_URL!;

export const controller = {
    // QUERY
    get(logger: ILogger, dbDependency: (jwt: string, query: qs.ParsedQs) => Promise<{ subreddit: string, count: number }[]>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                const posts = await dbDependency(req.headers.authorization!, req.query);
                logger.info(`Successful completion with status code 200`);
                res.status(200).json({subreddits: posts});
            }
            catch (err) {
                next(err);
            }
        }
    },
}