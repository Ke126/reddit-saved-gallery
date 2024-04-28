import express from 'express';
import morgan from 'morgan';
import { postsRouter } from './routes/posts.routes.js';
import { subredditsRouter } from './routes/subreddits.routes.js';

export const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/', postsRouter);
app.use('/', subredditsRouter);
