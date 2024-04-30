import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleUserSignUp = async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
  });

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered Successfully'));
};

export const handleUserSignIn = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }
  console.log(user);
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  if (!user) {
    throw new ApiError(401, 'Invalid Username or Password');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, user, 'User Logged in Successfully'));
};
