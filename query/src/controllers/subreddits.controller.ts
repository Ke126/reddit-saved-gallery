import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/models/mw-models.js"
import 'dotenv/config';

const QUERY_URL = process.env.QUERY_URL!;

export const controller = {
    // QUERY
    get(logger: ILogger, dbDependency: (jwt: string, query: qs.ParsedQs) => Promise<RedditPostDoc[]>) {
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
}