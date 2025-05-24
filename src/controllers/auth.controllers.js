import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ERROR_CODES } from "../utils/constants/error-codes.js";
import { ApiResponse } from "../utils/api-response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
import { generateRandomToken, isExpired } from "../utils/helpers.js";

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
      401,
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
  console.log("registerUser");
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
