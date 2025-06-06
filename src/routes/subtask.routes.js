import {
  createSubtask,
  updateSubtask,
  deleteSubtask,
  getAllSubTasks,
} from "../controllers/subtask.controllers.js";
import { Router } from "express";
import {
  validateProjectPermissions,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import { UserRolesEnum } from "../utils/constants/constants.js";
import {
  createSubtaskValidator,
  updateSubtaskValidator,
} from "../validators/subtask.validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router
  .route("/:projectId/:taskId")
  .post(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createSubtaskValidator(),
    validate,
    createSubtask,
  )
  .get(verifyToken, getAllSubTasks);

router
  .route("/:projectId/:subtaskId")
  .put(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.PROJECT_ADMIN,
      UserRolesEnum.ADMIN,
    ]),
    updateSubtaskValidator(),
    validate,
    updateSubtask,
  )
  .delete(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.PROJECT_ADMIN,
      UserRolesEnum.ADMIN,
    ]),
    validate,
    deleteSubtask,
  );

export default router;
