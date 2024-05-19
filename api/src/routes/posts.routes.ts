import express from 'express';
import { logIncomingRequest, checkAuthorization, validateBody, sendError } from '../shared/middleware.js';
import { controller } from '../controllers/posts.controller.js';
import makeLogger from '../shared/logger.js';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { fetcher } from '../shared/fetch.js';

export const postsRouter = express.Router();

const logger = makeLogger("API Service");
const logMiddleware = logIncomingRequest(logger);
const authorizationMiddleware = checkAuthorization(logger);
const errorMiddleware = sendError(logger);

const fetchThrice = tryThriceWrapper(logger, fetcher);

postsRouter.get('/posts', logMiddleware, authorizationMiddleware, controller.get(logger, fetchThrice), errorMiddleware);

postsRouter.post('/posts', logMiddleware, authorizationMiddleware, validateBody(logger, { 'username': 'string' }), controller.post(logger, fetchThrice), errorMiddleware);

postsRouter.patch('/posts/:id', logMiddleware, authorizationMiddleware, validateBody(logger, { 'pinned': 'boolean' }), controller.patch(logger, fetchThrice), errorMiddleware);