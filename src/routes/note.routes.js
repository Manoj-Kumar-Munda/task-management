import { Router } from "express";
import {
  validateProjectPermissions,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controllers.js";
import { UserRolesEnum } from "../utils/constants/constants.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createNoteValidator,
  updateNoteValidator,
} from "../validators/note.validators.js";

const router = Router();

router
  .route("/:projectId")
  .post(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createNoteValidator(),
    validate,
    createNote,
  )
  .get(verifyToken, getNotes);

router
  .route("/:projectId/:noteId")
  .get(verifyToken, getNoteById)
  .put(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    updateNoteValidator(),
    validate,
    updateNote,
  )
  .delete(
    verifyToken,
    validateProjectPermissions([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteNote,
  );

export default router;
