import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegistrationValidator,
  userLoginValidator,
} from "../validators/index.js";
import { registerUser, verifyEmail } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.single("avatar"), userLoginValidator(), validate, registerUser);

router.route("/verify/:token").get(verifyEmail);

export default router;
