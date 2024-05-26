import express from 'express';
import morgan from 'morgan';
import { makeLoggerService } from './shared/logger.js';
import { makeMongoDbService } from './services/mongoDbService.js';
import { makePostsController } from './controllers/postsController.js'
import { makeSubredditsController } from './controllers/subredditsController.js'
import { makeMiddleware } from './shared/middleware.js';

export async function bootstrap(port: number) {
    // construct services
    const loggerService = makeLoggerService("Query Service");
    const mongoDbService = makeMongoDbService(loggerService);

    // construct middleware and controllers
    const middleware = makeMiddleware(loggerService);
    const postsController = makePostsController(loggerService, mongoDbService);
    const subredditsController = makeSubredditsController(loggerService, mongoDbService);

    // construct app
    const app = express();
    app.use(express.json({ limit: '2mb' }));
    app.use(morgan('dev'));

    app.use(middleware.logRequest());
    app.use(middleware.checkAuthorization());

    app.get('/posts', postsController.getHandler());
    app.post('/posts', middleware.validateBody({ 'timestamp': 'number', 'posts': 'object' }), postsController.postHandler());
    app.patch('/posts/:id', middleware.validateBody({ 'pinned': 'boolean' }), postsController.patchHandler());
    app.put('/posts/:id', postsController.putHandler());
    app.delete('/posts/:id', postsController.deleteHandler());

    app.get('/subreddits', subredditsController.getHandler());

    app.use(middleware.notFoundHandler());
    app.use(middleware.errorHandler());

    // connect to db
    await mongoDbService.connect();

    // return server
    return app.listen(port, () => {
        loggerService.info(`Listening on port ${port}`);
    });
}