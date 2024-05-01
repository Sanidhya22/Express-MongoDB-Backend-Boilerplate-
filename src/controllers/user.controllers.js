import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleUserSignUp = async (req, res, next) => {
  try {
    const { fullName, email, username, password } = req.body;
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ''
      )
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
      throw new ApiError(
        500,
        'Something went wrong while registering the user'
      );
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, 'User registered Successfully'));
  } catch (err) {
    next(err);
  }
};

export const handleUserSignIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid user credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      '-password -refreshToken'
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag only in production
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        status: 'success',
        data: {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        message: 'User logged In Successfully',
      });
  } catch (err) {
    next(err);
  }
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating referesh and access token'
    );
  }
};
