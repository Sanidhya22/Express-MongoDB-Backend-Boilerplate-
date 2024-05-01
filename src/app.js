import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

const BASE_URL = '/api/v1';

app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// enable cors
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(`${BASE_URL}/users`, userRoutes);

app.use(errorHandler);

export default app;
