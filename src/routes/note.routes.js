import { Router } from "express";
import {
  validateProjectPermissions,
  verifyToken,
} from "../middlewares/auth.middleware.js";
import {
  deleteNote,
  getNoteById,
  updateNote,
} from "../controllers/note.controllers.js";
import { UserRolesEnum } from "../utils/constants/constants.js";
import { validate } from "../middlewares/validator.middleware.js";
import { updateNoteValidator } from "../validators/note.validators.js";

const router = Router();

router
  .route("/:noteId")
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
