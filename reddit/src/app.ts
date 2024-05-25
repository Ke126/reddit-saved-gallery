import express from 'express';
import morgan from 'morgan';
import { makeLoggerService } from './shared/logger.js';
import { makeHttpService } from './shared/fetch.js';
import { makeRedditApiService } from './services/redditApiService.js';
import { makePostsController } from './controllers/postsController.js'
import { makeMiddleware } from './shared/middleware.js';

export async function bootstrap(port: number) {
    // construct services
    const loggerService = makeLoggerService("Reddit Service");
    const httpService = makeHttpService(loggerService);
    const redditApiService = makeRedditApiService(loggerService, httpService.fetch);

    // construct middleware and controllers
    const middleware = makeMiddleware(loggerService);
    const postsController = makePostsController(loggerService, redditApiService);

    // construct app
    const app = express();
    app.use(express.json());
    app.use(morgan('dev'));

    app.use(middleware.logRequest());
    app.use(middleware.checkAuthorization());

    app.post('/posts', middleware.validateBody({ 'username': 'string' }), postsController.postHandler());
    app.put('/posts/:id', postsController.putHandler());
    app.delete('/posts/:id', postsController.deleteHandler());

    app.use(middleware.notFoundHandler());
    app.use(middleware.errorHandler());

    // return server
    return app.listen(port, () => {
        loggerService.info(`Listening on port ${port}`);
    });
}