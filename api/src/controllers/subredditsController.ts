import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/logger.models.js"
import 'dotenv/config';

export function makeSubredditsController(logger: ILogger, fetch: (arg: Request) => Promise<Response>) {
    const QUERY_URL = process.env.QUERY_URL!;
    return {
        // QUERY
        getHandler() {
            return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                try {
                    const response = await fetch(new Request(QUERY_URL + '/subreddits', {
                        headers: {
                            authorization: req.get('authorization')!,
                            'Content-Type': 'application/json'
                        },
                    }));
                    const json = await response.json();
                    res.status(response.status).json(json);
                }
                catch (err) {
                    next(err);
                }
            }
        }
    }
}