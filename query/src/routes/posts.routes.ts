import express from 'express';
import { logIncomingRequest, checkAuthorization, sendError, validateBody } from '../shared/middleware.js';
import { controller } from '../controllers/posts.controller.js';
import makeLogger from '../shared/logger.js';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { getUsersPosts, getPosts, insertToUser, insertToPosts } from '../utils/mongo.js';
import { readPosts, insertPosts } from '../utils/crud.js';

export const postsRouter = express.Router();

const logger = makeLogger("Query Service");
const logMiddleware = logIncomingRequest(logger);
const authorizationMiddleware = checkAuthorization(logger);
const errorMiddleware = sendError(logger);
const validateBodyMiddleware = validateBody(logger, { username: 'string' });

const getUsersThrice = tryThriceWrapper(logger, getUsersPosts);
const readThrice = tryThriceWrapper(logger, getPosts);
const insertToUsersThrice = tryThriceWrapper(logger, insertToUser);
const insertToPostsThrice = tryThriceWrapper(logger, insertToPosts);

const readPostsInjected = readPosts(logger, getUsersThrice, readThrice);
const insertPostsInjected = insertPosts(logger, insertToUsersThrice, insertToPostsThrice);

postsRouter.get('/posts', logMiddleware, authorizationMiddleware, controller.get(logger, readPostsInjected), errorMiddleware);

postsRouter.post('/posts', logMiddleware, authorizationMiddleware, validateBodyMiddleware, controller.post(logger, insertPostsInjected), errorMiddleware);