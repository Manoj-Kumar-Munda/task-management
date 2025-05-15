import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ERROR_CODES } from "../utils/constants/error-codes.js";
import { ApiResponse } from "../utils/api-response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
import crypto from "crypto";
import { isExpired } from "../utils/helpers.js";

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
    avatar: avatarUrl ?? "https://placehold.co/600x400",
  });

  if (!newUser) {
    throw new ApiError(500, "Internal server error");
  }

  const token = crypto.randomBytes(32).toString("hex");
  newUser.emailVerificationToken = token;
  await newUser.save();

  const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;
  await sendMail({
    email,
    subject: "Verify your email",
    mailGenContent: emailVerificationMailGenContent(
      newUser?.username,
      verificationUrl,
    ),
  });

  newUser.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); //24h
  await newUser.save();

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
  const { token } = req.params;
  console.log("registerUser", token);

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new ApiError(400, "Invalid token");
  }

  if (isExpired(user.emailVerificationExpiry)) {
    throw new ApiError(400, "token expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, user, "Email verified"));
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
