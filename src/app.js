import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';

const app = express();

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

const BASE_URL = '/api/v1';

app.use(`${BASE_URL}/users`, userRoutes);

export default app;
