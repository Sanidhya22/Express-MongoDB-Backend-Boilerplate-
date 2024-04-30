import express from 'express';
import {
  handleUserSignIn,
  handleUserSignUp,
} from '../controllers/user.controllers.js';

const router = express.Router();

router.route('/').post((req, res) => {
  res.send('user routes');
});

router.route('/signup').post(handleUserSignUp);

router.route('/signin').post(handleUserSignIn);

export default router;
