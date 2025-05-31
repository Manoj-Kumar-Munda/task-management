import { Router } from "express";
import {
  validateProjectPermissions,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import { createTask } from "../controllers/task.controllers.js";
import { createTaskValidator } from "../validators/task.validators.js";
import { UserRolesEnum } from "../utils/constants/constants.js";

const router = Router();

router
  .route("/")
  .post(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createTaskValidator(),
    validate,
    createTask,
  );

export default router;
