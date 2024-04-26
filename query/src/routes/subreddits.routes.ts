import express from 'express';
import { logIncomingRequest, checkAuthorization, sendError } from '../shared/middleware.js';
import { controller } from '../controllers/subreddits.controller.js';
import makeLogger from '../shared/logger.js';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { fetcher } from '../shared/fetch.js';

export const subredditsRouter = express.Router();

const logger = makeLogger("API Service");
const logMiddleware = logIncomingRequest(logger);
const authorizationMiddleware = checkAuthorization(logger);
const errorMiddleware = sendError(logger);

const fetchThrice = tryThriceWrapper(logger, fetcher);

subredditsRouter.get('/subreddits', logMiddleware, authorizationMiddleware, controller.get(logger, fetchThrice), errorMiddleware);