import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegistrationValidator,
  userLoginValidator,
} from "../validators/index.js";
import { registerUser } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(userLoginValidator(), validate, registerUser);
