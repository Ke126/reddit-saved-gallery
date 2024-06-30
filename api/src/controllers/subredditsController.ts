import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/loggerModel.js"

export function makeSubredditsController(logger: ILogger, fetchFunc: typeof fetch) {
    const QUERY_URL = `http://query:${process.env.QUERY_PORT}`;
    return {
        // QUERY
        getHandler() {
            return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                try {
                    const response = await fetchFunc(new Request(QUERY_URL + '/subreddits', {
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