import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import { postsRouter } from './routes/posts.routes.js'

export const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(compression());

app.use('/', postsRouter);
