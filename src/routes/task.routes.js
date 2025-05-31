import { Router } from "express";
import {
  validateProjectPermissions,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import {
  createTask,
  updateStatus,
  updateTask,
} from "../controllers/task.controllers.js";
import {
  createTaskValidator,
  updateStatusValidator,
  updateTaskValidator,
} from "../validators/task.validators.js";
import { UserRolesEnum } from "../utils/constants/constants.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router
  .route("/:projectId")
  .post(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachments"),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:taskId")
  .put(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    updateTaskValidator(),
    validate,
    updateTask,
  )
  .patch(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
      UserRolesEnum.MEMBER,
    ]),
    updateStatusValidator(),
    validate,
    updateStatus,
  );

router.route("/:taskId");

export default router;
