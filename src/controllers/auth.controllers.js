import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ERROR_CODES } from "../utils/constants/error-codes.js";
import { ApiResponse } from "../utils/api-response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullName } = req.body;

  const isUserExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExists) {
    throw new ApiError(
      409,
      "User already registered",
      ERROR_CODES.AUTH.USER_EXISTS,
    );
  }

  const avatarLocalUrl = req?.file?.path;

  const avatarUrl = await uploadOnCloudinary(avatarLocalUrl);

  if (!avatarUrl) {
    throw new ApiError(500, "Internal server error");
  }

  const newUser = await User.create({
    email,
    username,
    fullName,
    password,
    avatar: avatarUrl,
  });

  if (!newUser) {
    throw new ApiError(500, "Internal server error");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User registred successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("registerUser");
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPassword,
  changeCurrentPassword,
  getCurrentUser,
};
