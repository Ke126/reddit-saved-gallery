import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express"
import type { ILogger } from "../shared/logger.models.js"
import 'dotenv/config';
import qs from "qs";

const QUERY_URL = process.env.QUERY_URL!;
const REDDIT_URL = process.env.REDDIT_URL!;

export const controller = {
    // QUERY
    get(logger: ILogger, fetchDependency: (arg: Request) => Promise<Response>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                const response = await fetchDependency(new Request(QUERY_URL + '/posts?' + qs.stringify(req.query), {
                    headers: {
                        authorization: req.headers.authorization || "",
                        'Content-Type': 'application/json'
                    },
                }));
                const json = await response.json();
                logger.http(`Successful completion with status code ${response.status}`);
                res.status(response.status).json(json);
            }
            catch (err) {
                next(err);
            }
        }
    },
    // REDDIT -> QUERY
    post(logger: ILogger, fetchDependency: (arg: Request) => Promise<Response>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                const response = await fetchDependency(new Request(REDDIT_URL + '/posts', {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: {
                        authorization: req.headers.authorization || "",
                        'Content-Type': 'application/json'
                    }
                }));
                const json = await response.json();
                logger.http(`Successful completion with status code ${response.status}`);
                res.status(response.status).json(json);
            }
            catch (err) {
                next(err);
            }
        }
    },
    // QUERY
    // REDDIT -> QUERY
    put(logger: ILogger, fetchDependency: (arg: Request) => Promise<Response>) {
        return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            try {
                const response = await fetchDependency(new Request(QUERY_URL + '/posts/' + req.params.id, {
                    method: "PUT",
                    body: JSON.stringify(req.body),
                    headers: {
                        authorization: req.headers.authorization || "",
                        'Content-Type': 'application/json'
                    }
                }));
                const json = await response.json();
                logger.http(`Successful completion with status code ${response.status}`);
                res.status(response.status).json(json);
            }
            catch (err) {
                next(err);
            }
        }
    },
    // REDDIT -> QUERY
    delete() {}
}