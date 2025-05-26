import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
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
    addProjectToMemberValidator(),
    validate,
    addProjectToMember,
  )
  .get(verifyToken, getProjectMembers);

router
  .route("/:projectId/members/:memberId")
  .put(verifyToken, updateMemberRoleValidator(), validate, updateMemberRole)
  .delete(verifyToken, deleteMember);

export default router;
