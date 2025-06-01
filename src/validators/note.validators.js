import { body, param, query } from "express-validator";

const createNoteValidator = () => {
  return [
    param("projectId")
      .isMongoId()
      .withMessage("Project ID must be a valid MongoDB ObjectID"),
    body("content")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Note content is required"),
  ];
};

const updateNoteValidator = () => {
  return [
    query("projectId")
      .isMongoId()
      .withMessage("Project ID must be a valid MongoDB ObjectID"),
    param("noteId")
      .isMongoId()
      .withMessage("Note ID must be a valid MongoDB ObjectID"),
    body("content")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Note content is required"),
  ];
};

export { createNoteValidator, updateNoteValidator };
