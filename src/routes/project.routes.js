import { Router } from "express";
import {
  validateProjectPermissions,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import {
  addProjectToMemberValidator,
  createProjectValidator,
  updateMemberRoleValidator,
} from "../validators/project.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  addProjectToMember,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
} from "../controllers/project.controllers.js";
import { UserRolesEnum } from "../utils/constants/constants.js";

const router = Router();

router
  .route("/")
  .get(verifyToken, getProjects)
  .post(verifyToken, createProjectValidator(), validate, createProject);

router
  .route("/:projectId")
  .get(verifyToken, getProjectById)
  .put(verifyToken, createProjectValidator(), validate, updateProject)
  .delete(verifyToken, deleteProject);

router
  .route("/:projectId/members")
  .post(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    addProjectToMemberValidator(),
    validate,
    addProjectToMember,
  )
  .get(verifyToken, getProjectMembers);

router
  .route("/:projectId/members/:memberId")
  .put(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    updateMemberRoleValidator(),
    validate,
    updateMemberRole,
  )
  .delete(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteMember,
  );

export default router;
