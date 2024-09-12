import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { Logger } from './shared/logger.js';
import { makeHttpService } from './shared/fetch.js';
import { makePostsController } from './controllers/postsController.js';
import { makeSubredditsController } from './controllers/subredditsController.js';
import { makeMiddleware } from './shared/middleware.js';

export async function bootstrap(port: number) {
    // construct services
    const loggerService = new Logger('API Service');
    const httpService = makeHttpService(loggerService);

    // construct middleware and controllers
    const middleware = makeMiddleware(loggerService);
    const postsController = makePostsController(
        loggerService,
        httpService.fetch,
    );
    const subredditsController = makeSubredditsController(
        loggerService,
        httpService.fetch,
    );

    // construct app
    const app = express();
    app.use(helmet());
    app.use(express.json());
    app.use(morgan('dev'));

    app.use(middleware.logRequest());
    app.use(middleware.checkAuthorization());

    app.get('/posts', postsController.getHandler());
    app.post(
        '/posts',
        middleware.validateBody({ username: 'string' }),
        postsController.postHandler(),
    );
    app.patch(
        '/posts/:id',
        middleware.validateBody({ pinned: 'boolean' }),
        postsController.patchHandler(),
    );
    app.put('/posts/:id', postsController.putHandler());
    app.delete('/posts/:id', postsController.deleteHandler());

    app.get('/subreddits', subredditsController.getHandler());

    app.use(middleware.notFoundHandler());
    app.use(middleware.errorHandler());

    // return server
    return app.listen(port, () => {
        loggerService.info(`Listening on port ${port}`);
    });
}
