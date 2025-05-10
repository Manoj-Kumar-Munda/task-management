import { asyncHandler } from "../utils/async-handler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
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
