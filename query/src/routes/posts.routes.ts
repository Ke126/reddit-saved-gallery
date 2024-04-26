import express, { Request, Response, NextFunction } from 'express';
import * as crud from '../modules/crud.js'
import errorMiddleware from '../shared/error-mw.js';
import * as models from '../shared/models/models.js'
import logger from '../shared/logger.js';

export const postsRouter = express.Router();

router.get('/posts', async (req: Request, res: Response, next: NextFunction) => {
    logger.http(`(${process.pid}) Query Service received GET request to /posts`);
    // read data from database using query if exists
    try {
        const data = await crud.readPosts(req.query as models.GetQuery);
        res.status(200).json(data);
    }
    catch (err) {
        logger.error(`(${process.pid}) Query Service error: ${(err as Error).message}`);
        next(err);
    }
});

router.get('/subreddits', async (req: Request, res: Response, next: NextFunction) => {
    logger.http(`(${process.pid}) Query Service received GET request to /subreddits`);
    // read data from database
    try {
        const data = await crud.countSubreddits();
        res.status(200).json(data);
    }
    catch (err) {
        logger.error(`(${process.pid}) Query Service error: ${(err as Error).message}`);
        next(err);
    }
});

router.put('/posts', async (req: Request, res: Response, next: NextFunction) => {
    logger.http(`(${process.pid}) Query Service received PUT request to /posts`);
    // add batch of new posts
    const posts = req.body;
    try {
        await crud.insertPosts(posts);
        res.status(200).json({ status: 'OK' });
    }
    catch (err) {
        logger.error(`(${process.pid}) Query Service error: ${(err as Error).message}`);
        next(err);
    }
});

router.put('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
    logger.http(`(${process.pid}) Query Service received PUT request to /posts/:id`);
    // update post favorite
    const id = req.params.id;
    const favorite = req.body.favorite;
    try {
        await crud.favoritePost(id, favorite);
        res.status(200).json({ status: 'OK' });
    }
    catch (err) {
        logger.error(`(${process.pid}) Query Service error: ${(err as Error).message}`);
        next(err);
    }
});

router.use(errorMiddleware);