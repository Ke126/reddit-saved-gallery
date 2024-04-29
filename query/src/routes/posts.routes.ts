import express from 'express';
import { logIncomingRequest, checkAuthorization, sendError, validateBody } from '../shared/middleware.js';
import { controller } from '../controllers/posts.controller.js';
import makeLogger from '../shared/logger.js';
import { tryThriceWrapper } from '../shared/tryThrice.js';
import { getUsersPosts, getPosts, insertToUser, insertToPosts, favoriteToUser, getUsersPosts2 } from '../utils/mongo.js';
import { readPosts, insertPosts, favoritePost, readPosts2 } from '../utils/crud.js';

export const postsRouter = express.Router();

const logger = makeLogger("Query Service");
const logMiddleware = logIncomingRequest(logger);
const authorizationMiddleware = checkAuthorization(logger);
const errorMiddleware = sendError(logger);

const getUsersThrice = tryThriceWrapper(logger, getUsersPosts);
const readThrice = tryThriceWrapper(logger, getPosts);
const insertToUsersThrice = tryThriceWrapper(logger, insertToUser);
const insertToPostsThrice = tryThriceWrapper(logger, insertToPosts);
const favoriteToUserThrice = tryThriceWrapper(logger, favoriteToUser);

const newReadThrice = tryThriceWrapper(logger, getUsersPosts2);
const newReadPostsInjected = readPosts2(logger, newReadThrice);

const readPostsInjected = readPosts(logger, getUsersThrice, readThrice);
const insertPostsInjected = insertPosts(logger, insertToUsersThrice, insertToPostsThrice);
const favoritePostInjected = favoritePost(logger, favoriteToUserThrice);

postsRouter.get('/posts', logMiddleware, authorizationMiddleware, controller.get(logger, newReadPostsInjected), errorMiddleware);

postsRouter.post('/posts', logMiddleware, authorizationMiddleware, validateBody(logger, { 'timestamp': 'number', 'posts': 'object' }), controller.post(logger, insertPostsInjected), errorMiddleware);

postsRouter.patch('/posts/:id', logMiddleware, authorizationMiddleware, validateBody(logger, { 'favorited': 'boolean' }), controller.patch(logger, favoritePostInjected), errorMiddleware);