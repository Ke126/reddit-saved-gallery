import express from 'express';
import { logIncomingRequest, checkAuthorization, validateBody, sendError } from '../shared/middleware.js';
import { controller } from '../controllers/posts.controller.js';
import makeLogger from '../shared/logger.js';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { fetcher } from '../shared/fetch.js';
import { mkFetchAndSend } from '../utils/reddit.js';

export const postsRouter = express.Router();

const logger = makeLogger("Reddit Service");
const logMiddleware = logIncomingRequest(logger);
const authorizationMiddleware = checkAuthorization(logger);
const errorMiddleware = sendError(logger);

const fetchAndSend = mkFetchAndSend(logger, tryThriceWrapper(logger, fetcher));

postsRouter.post('/posts', logMiddleware, authorizationMiddleware, validateBody(logger, { 'username': 'string' }), controller.post(logger, fetchAndSend), errorMiddleware);
