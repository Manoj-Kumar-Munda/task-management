import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  resendVerficationValidator,
  userLoginValidator,
} from "../validators/index.js";
import {
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.single("avatar"), userLoginValidator(), validate, registerUser);
router.route("/verify/:token").get(verifyEmail);
router
  .route("/resend-verificationmail")
  .post(resendVerficationValidator(), validate, resendVerificationEmail);
router.route("/login").post(userLoginValidator(), validate, loginUser);

export default router;
