import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ERROR_CODES } from "../utils/constants/error-codes.js";
import { ApiResponse } from "../utils/api-response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
  sendMail,
} from "../utils/mail.js";
import { generateRandomToken, isExpired } from "../utils/helpers.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

  //TODO: use fn defined in User model
  const token = generateRandomToken();
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

// TODO: remove forgotPasswordExpiry and forgotPasswordToken from response
const loginUser = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: userId }, { username: userId }],
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordMatched = await user.isPasswordCorrect(password);

  if (!isPasswordMatched) {
    throw new ApiError(
      401,
      "Password not matched",
      ERROR_CODES.AUTH.INVALID_CREDENTIALS,
    );
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      400,
      "User not verified",
      ERROR_CODES.AUTH.USER_NOT_VERIFIED,
    );
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  user.refreshToken = refreshToken;
  await user.save();

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken",
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser, accessToken },
        "User logged in",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  user.refreshToken = undefined;
  await user.save();

  res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
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

//TODO: need to check what to get from the user in payload
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(403, "Email not registered");
  }
  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }
  const token = generateRandomToken();
  user.emailVerificationToken = token;
  await user.save();
  const verificationUrl = `${process.env.BASE_URL}/api/v1/users/verify/${token}`;
  await sendMail({
    email,
    subject: "Verify your email",
    mailGenContent: emailVerificationMailGenContent(
      user?.username,
      verificationUrl,
    ),
  });

  user.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, [], "Verfication email sent"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "refreshToken is required");
  }

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  console.log(decodedToken);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(400, "Inavalid token");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { accessToken: newAccessToken },
        "new tokens generated",
      ),
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "user not registered");
  }

  // hashedToken -> db , unHashedToken -> response
  const { hashedToken, unHashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: tokenExpiry,
    },
  );

  if (!updatedUser) {
    throw new ApiError(500, "Internal server error");
  }

  //send forgot password email -> send FE forgot password page url
  const resetPasswordUrl = `${process.env.BASE_URL}/api/v1/users/reset-password/${unHashedToken}`;

  await sendMail({
    email,
    subject: "Reset your password",
    mailGenContent: forgotPasswordMailGenContent(
      user?.username,
      resetPasswordUrl,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Forgot password mail sent"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const receivedToken = req?.params?.token;

  const { oldPassword, newPassword } = req.body;

  const hashedReceivedToken = crypto
    .createHash("sha256")
    .update(receivedToken)
    .digest("hex");

  const user = await User.findOne({ forgotPasswordToken: hashedReceivedToken });

  if (!user) {
    throw new ApiError(400, "Invalid token");
  }

  if (isExpired(user?.forgotPasswordExpiry)) {
    throw new ApiError(409, "token expired");
  }

  const isPasswordMatched = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Wrong password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(200).json(new ApiResponse(200, user, "user data"));
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select(
    "-password -refreshToken -emailVerificationToken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, users, "users fetched successfully"));
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
  getUsers,
};
