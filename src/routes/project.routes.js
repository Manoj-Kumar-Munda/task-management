import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createProjectValidator } from "../validators/project.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProject,
  getProjectById,
  getProjects,
} from "../controllers/project.controllers.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  createProjectValidator(),
  validate,
  createProject,
);

router.get("/", verifyToken, getProjects);
router.get("/:projectId", verifyToken, getProjectById);

export default router;
