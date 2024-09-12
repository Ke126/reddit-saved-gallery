import type { Request, Response, NextFunction } from 'express';
import type { ILogger } from './loggerModel.js';

export default function forward(
    logger: ILogger,
    baseURL: string,
    routeFunction: (route: string) => string = (_) => _,
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = Object.entries(req.query).reduce(
                (accum, [key, value], index) => {
                    const delim = index === 0 ? '?' : '&';
                    return (
                        accum +
                        delim +
                        `${encodeURIComponent(key)}${encodeURIComponent(value!.toString())}`
                    );
                },
                '',
            );
            const url = `${baseURL}${routeFunction(req.path)}${query}`;
            const response = await fetch(url, {
                method: req.method,
                body: JSON.stringify(req.body),
                headers: { Authorization: req.headers.authorization! },
            });
            const json = await response.json;
            logger.http(
                `Forwarded ${req.method} ${req.path} request to ${baseURL}`,
            );
            res.status(response.status).json(json);
        } catch (err) {
            next(err);
        }
    };
}
