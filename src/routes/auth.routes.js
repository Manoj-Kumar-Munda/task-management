import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  changePasswordValidator,
  forgotPasswordValidator,
  resendVerficationValidator,
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import {
  changeCurrentPassword,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    upload.single("avatar"),
    userRegistrationValidator(),
    validate,
    registerUser,
  );
router.route("/verify/:token").get(verifyEmail);
router
  .route("/resend-verificationmail")
  .post(resendVerficationValidator(), validate, resendVerificationEmail);

router.route("/login").post(userLoginValidator(), validate, loginUser);

router.route("/logout").post(verifyToken, logoutUser);

router
  .route("/forgot-password")
  .post(forgotPasswordValidator(), validate, forgotPassword);

router
  .route("/change-password/:token")
  .post(changePasswordValidator(), validate, changeCurrentPassword);

router.route("/me").get(verifyToken, getCurrentUser);

export default router;
