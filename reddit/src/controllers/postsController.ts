import type {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction,
} from 'express';
import type { ILogger } from '../shared/loggerModel.js';
import { IRedditApiService } from '../services/redditApiServiceModel.js';

export function makePostsController(
    logger: ILogger,
    redditApiService: IRedditApiService,
) {
    return {
        // REDDIT -> QUERY
        postHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    await redditApiService.pullSavedPosts(
                        req.get('authorization')!,
                        req.body.username,
                    );
                    res.status(202).json({ message: 'Accepted' });
                } catch (err) {
                    next(err);
                }
            };
        },
        putHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    await redditApiService.savePost(
                        req.get('authorization')!,
                        req.params.id,
                    );
                    res.status(202).json({ message: 'Accepted' });
                } catch (err) {
                    next(err);
                }
            };
        },
        deleteHandler() {
            return async (
                req: ExpressRequest,
                res: ExpressResponse,
                next: NextFunction,
            ) => {
                try {
                    await redditApiService.unsavePost(
                        req.get('authorization')!,
                        req.params.id,
                    );
                    res.status(202).json({ message: 'Accepted' });
                } catch (err) {
                    next(err);
                }
            };
        },
    };
}
