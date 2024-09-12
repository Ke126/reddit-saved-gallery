import type {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction,
} from 'express';
import type { ILogger } from '../shared/loggerModel.js';
import qs from 'qs';

export function makePostsController(logger: ILogger, fetchFunc: typeof fetch) {
    const QUERY_URL = `http://query:${process.env.QUERY_PORT || 4001}`;
    const REDDIT_URL = `http://reddit:${process.env.REDDIT_PORT || 4002}`;
    return {
        // QUERY
        getHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    const response = await fetchFunc(
                        new Request(
                            QUERY_URL + '/posts?' + qs.stringify(req.query),
                            {
                                headers: {
                                    authorization: req.get('authorization')!,
                                    'Content-Type': 'application/json',
                                },
                            },
                        ),
                    );
                    const json = await response.json();
                    res.status(response.status).json(json);
                } catch (err) {
                    next(err);
                }
            };
        },
        // REDDIT -> QUERY
        postHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    const response = await fetchFunc(
                        new Request(REDDIT_URL + '/posts', {
                            method: 'POST',
                            body: JSON.stringify(req.body),
                            headers: {
                                authorization: req.get('authorization')!,
                                'Content-Type': 'application/json',
                            },
                        }),
                    );
                    const json = await response.json();
                    res.status(response.status).json(json);
                } catch (err) {
                    next(err);
                }
            };
        },
        // QUERY
        // REDDIT -> QUERY
        patchHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    const response = await fetchFunc(
                        new Request(QUERY_URL + '/posts/' + req.params.id, {
                            method: 'PATCH',
                            body: JSON.stringify(req.body),
                            headers: {
                                authorization: req.get('authorization')!,
                                'Content-Type': 'application/json',
                            },
                        }),
                    );
                    const json = await response.json();
                    res.status(response.status).json(json);
                } catch (err) {
                    next(err);
                }
            };
        },
        // REDDIT + QUERY
        putHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    await fetchFunc(
                        new Request(REDDIT_URL + '/posts/' + req.params.id, {
                            method: 'PUT',
                            headers: {
                                authorization: req.get('authorization')!,
                                'Content-Type': 'application/json',
                            },
                        }),
                    );
                    const response = await fetchFunc(
                        new Request(QUERY_URL + '/posts/' + req.params.id, {
                            method: 'PUT',
                            headers: {
                                authorization: req.get('authorization')!,
                                'Content-Type': 'application/json',
                            },
                        }),
                    );
                    const json = await response.json();
                    res.status(response.status).json(json);
                } catch (err) {
                    next(err);
                }
            };
        },
        // REDDIT + QUERY
        deleteHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    await fetchFunc(
                        new Request(REDDIT_URL + '/posts/' + req.params.id, {
                            method: 'DELETE',
                            headers: {
                                authorization: req.get('authorization')!,
                                'Content-Type': 'application/json',
                            },
                        }),
                    );
                    const response = await fetchFunc(
                        new Request(QUERY_URL + '/posts/' + req.params.id, {
                            method: 'DELETE',
                            headers: {
                                authorization: req.get('authorization')!,
                                'Content-Type': 'application/json',
                            },
                        }),
                    );
                    const json = await response.json();
                    res.status(response.status).json(json);
                } catch (err) {
                    next(err);
                }
            };
        },
    };
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
