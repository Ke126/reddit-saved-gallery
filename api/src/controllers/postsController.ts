import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/loggerModel.js"
import 'dotenv/config';
import qs from "qs";

export function makePostsController(logger: ILogger, fetch: (arg: Request) => Promise<Response>) {
    const QUERY_URL = process.env.QUERY_URL!;
    const REDDIT_URL = process.env.REDDIT_URL!;
    return {
        // QUERY
        getHandler() {
            return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                try {
                    const response = await fetch(new Request(QUERY_URL + '/posts?' + qs.stringify(req.query), {
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
        },
        // REDDIT -> QUERY
        postHandler() {
            return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                try {
                    const response = await fetch(new Request(REDDIT_URL + '/posts', {
                        method: 'POST',
                        body: JSON.stringify(req.body),
                        headers: {
                            authorization: req.get('authorization')!,
                            'Content-Type': 'application/json'
                        }
                    }));
                    const json = await response.json();
                    res.status(response.status).json(json);
                }
                catch (err) {
                    next(err);
                }
            }
        },
        // QUERY
        // REDDIT -> QUERY
        patchHandler() {
            return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                try {
                    const response = await fetch(new Request(QUERY_URL + '/posts/' + req.params.id, {
                        method: "PATCH",
                        body: JSON.stringify(req.body),
                        headers: {
                            authorization: req.get('authorization')!,
                            'Content-Type': 'application/json'
                        }
                    }));
                    const json = await response.json();
                    res.status(response.status).json(json);
                }
                catch (err) {
                    next(err);
                }
            }
        },
        // REDDIT -> QUERY
        deleteHandler() { }
    }
    // return [
    //     {
    //         method: 'get',
    //         path: '/posts',
    //         handler: () => async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    //             try {
    //                 const response = await fetch(new Request(QUERY_URL + '/posts?' + qs.stringify(req.query), {
    //                     headers: {
    //                         authorization: req.headers.authorization!,
    //                         'Content-Type': 'application/json'
    //                     },
    //                 }));
    //                 const json = await response.json();
    //                 logger.http(`Successful completion with status code ${response.status}`);
    //                 res.status(response.status).json(json);
    //             }
    //             catch (err) {
    //                 next(err);
    //             }
    //         }
    //     },
    //     {
            
    //     }
    // ]
}