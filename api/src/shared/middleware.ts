import type { Request, Response, NextFunction } from "express";
import type { ILogger } from './loggerModel.js';

export function makeMiddleware(logger: ILogger) {
    return {
        logRequest() {
            return (req: Request, res: Response, next: NextFunction) => {
                const start = performance.now();
                logger.http(`Received ${req.method} ${req.path}`);
                next();
                logger.http(`Completed ${req.method} ${req.path} in ${(performance.now() - start).toFixed(3)} ms with status ${res.statusCode}`);
            }
        },
        checkAuthorization() {
            return (req: Request, res: Response, next: NextFunction) => {
                if (!req.get('authorization')) {
                    res.status(401).json({ error: 'Unauthorized' });
                }
                else next();
            }
        },
        validateBody(schema: { [k: string]: "string" | "number" | "boolean" | "object" }) {
            return (req: Request, res: Response, next: NextFunction) => {
                // check body for minimum criteria
                if (Object.keys(schema).some(key => !Object.hasOwn(req.body, key) || (typeof (req.body[key]) !== schema[key]))) {
                    res.status(400).json({ error: 'Bad Request' });
                }
                else next()
            }
        },
        notFoundHandler() {
            return (req: Request, res: Response) => {
                res.status(404).json({ error: "Not Found" });
            }
        },
        errorHandler() {
            return (err: Error, req: Request, res: Response) => {
                if (res.headersSent) {
                    return;
                }
                else {
                    logger.error(err.message);
                    res.status(500).json({ error: "Internal Server Error" });
                }
            }
        }
    }
}
