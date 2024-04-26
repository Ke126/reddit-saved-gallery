import type { Request, Response, NextFunction } from "express";
import type { ILogger } from './logger.models.js';

export function logIncomingRequest(logger: ILogger) {
    return (req: Request, res: Response, next: NextFunction) => {
        logger.http(`Received ${req.method} request to ${req.path}`);
        next();
    }
}

export function checkAuthorization(logger: ILogger) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers || !req.headers.authorization) {
            logger.warn('Not authorized');
            res.status(401).json({ error: 'Not authorized' });
        }
        else next();
    }
}

export function validateBody(logger: ILogger, schema: { [k: string]: "string" | "number" | "boolean" | "object" }) {
    return (req: Request, res: Response, next: NextFunction) => {
        const badResponse = () => {
            logger.warn('Bad request body')
            res.status(400).json({ error: 'Bad request body' });
        }
        // check body for minimum criteria
        if (Object.keys(schema).some(key => !req.body[key] || (typeof (req.body[key]) !== schema[key]))) badResponse();
        else next()
    }
}

export function sendError(logger: ILogger) {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return;
        }
        else {
            logger.error(err.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}