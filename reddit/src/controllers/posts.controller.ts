import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/logger.models.js"
import 'dotenv/config';
import qs from "qs";

const QUERY_URL = process.env.QUERY_URL!;
const REDDIT_URL = process.env.REDDIT_URL!;

export const controller = {
    // REDDIT -> QUERY
    post(logger: ILogger, fetchAndSendDependency: (jwt: string, username: string) => Promise<void>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                await fetchAndSendDependency(req.headers.authorization!, req.body.username);
                logger.info(`Successful completion with status code 201`);
                res.status(201).json({ status: 201 });
            }
            catch (err) {
                next(err);
            }
        }
    },
}