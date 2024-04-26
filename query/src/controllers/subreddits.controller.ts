import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/models/mw-models.js"
import 'dotenv/config';

const QUERY_URL = process.env.QUERY_URL!;

export const controller = {
    // QUERY
    get(logger: ILogger, fetchDependency: (arg: Request) => Promise<Response>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                const response = await fetchDependency(new Request(QUERY_URL + '/subreddits', {
                    headers: {
                        authorization: req.headers.authorization || ""
                    },
                }));
                const json = await response.json();
                logger.info(`Successful completion with status code ${response.status}`);
                res.status(response.status).json(json);
            }
            catch (err) {
                next(err);
            }
        }
    }
}