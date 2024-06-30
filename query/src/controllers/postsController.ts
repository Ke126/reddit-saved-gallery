import type { Request, Response, NextFunction } from "express"
import type { ILogger } from '../shared/loggerModel.js'
import { IMongoDbService } from "../services/mongoDbServiceModel.js";
import { parseJwt, parseQuery } from "../utils/parse.js";

export function makePostsController(logger: ILogger, mongoDbService: IMongoDbService) {
    return {
        getHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user = parseJwt(req.get('authorization')!);
                    const query = parseQuery(req.query);
                    const posts = await mongoDbService.readPosts(user, query);
                    res.status(200).json(posts);
                }
                catch (err) {
                    next(err);
                }
            }
        },
        // REDDIT -> QUERY
        postHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user = parseJwt(req.get('authorization')!);
                    await mongoDbService.upsertPosts(user, req.body.posts, req.body.timestamp);
                    res.status(202).json({ message: 'Accepted' });
                }
                catch (err) {
                    next(err);
                }
            }
        },
        // QUERY
        // REDDIT -> QUERY
        patchHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user = parseJwt(req.get('authorization')!);
                    await (req.body.pinned ? mongoDbService.pinPost(user, req.params.id) : mongoDbService.unpinPost(user, req.params.id));
                    res.status(202).json({ message: 'Accepted' });
                }
                catch (err) {
                    next(err);
                }
            }
        },
        putHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user = parseJwt(req.get('authorization')!);
                    await mongoDbService.savePost(user, req.params.id);
                    res.status(202).json({ message: 'Accepted' });
                }
                catch (err) {
                    next(err);
                }
            }
        },
        // // REDDIT -> QUERY
        deleteHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user = parseJwt(req.get('authorization')!);
                    await mongoDbService.unsavePost(user, req.params.id);
                    res.status(202).json({ message: 'Accepted' });
                }
                catch (err) {
                    next(err);
                }
            }
        }
    }
}