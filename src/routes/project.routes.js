import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createProjectValidator } from "../validators/project.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProject,
  getProjectById,
  getProjects,
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
  .put(verifyToken, createProjectValidator(), validate, updateProject);

export default router;
