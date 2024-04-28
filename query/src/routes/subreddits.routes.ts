import express from 'express';
import { logIncomingRequest, checkAuthorization, sendError } from '../shared/middleware.js';
import { controller } from '../controllers/subreddits.controller.js';
import makeLogger from '../shared/logger.js';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { getUsersPosts, getSubreddits } from '../utils/mongo.js';
import { readSubreddits } from '../utils/crud.js';

export const subredditsRouter = express.Router();

const logger = makeLogger("Query Service");
const logMiddleware = logIncomingRequest(logger);
const authorizationMiddleware = checkAuthorization(logger);
const errorMiddleware = sendError(logger);

const getUsersThrice = tryThriceWrapper(logger, getUsersPosts);
const readThrice = tryThriceWrapper(logger, getSubreddits);
const readSubredditsInjected = readSubreddits(logger, getUsersThrice, readThrice)

subredditsRouter.get('/subreddits', logMiddleware, authorizationMiddleware, controller.get(logger, readSubredditsInjected), errorMiddleware);