import { body, param } from "express-validator";

const createSubtaskValidator = () => {
  return [
    param("taskId")
      .isMongoId()
      .withMessage("Task ID must be a valid MongoDB ObjectID"),
    body("title")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Subtask title is required")
      .isLength({ min: 3 })
      .withMessage("Subtask title should be at least 3 characters long"),
  ];
};

const updateSubtaskValidator = () => {
  return [
    param("subtaskId")
      .isMongoId()
      .withMessage("Subtask ID must be a valid MongoDB ObjectID"),
    body("title")
      .isString()
      .trim()
      .optional()
      .isLength({ max: 100 })
      .withMessage("Subtask title should be at most 100 characters long"),
    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("isCompleted must be a boolean value"),
  ];
};

export { createSubtaskValidator, updateSubtaskValidator };
