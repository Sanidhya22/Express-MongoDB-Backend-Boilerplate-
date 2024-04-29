import express from 'express';
import cors from 'cors';

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
// app.use('/api/v1', routes);

// // send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   next('Not found 404');
// });

export default app;
