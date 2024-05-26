import type { Request, Response, NextFunction } from "express"
import type { ILogger } from '../shared/loggerModel.js';
import 'dotenv/config';
import { IMongoDbService } from "../services/mongoDbServiceModel.js";
import { parseJwt } from "../utils/parse.js";

export function makeSubredditsController(logger: ILogger, mongoDbService: IMongoDbService) {
    return {
        getHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user = parseJwt(req.get('authorization')!);
                    const subreddits = await mongoDbService.readSubreddits(user);
                    res.status(200).json({ subreddits: subreddits });
                }
                catch (err) {
                    next(err);
                }
            }
        },
    }
}