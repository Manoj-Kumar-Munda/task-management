import { body, param } from "express-validator";

const createTaskValidator = (req, res, next) => {
  return [
    param("projectId")
      .notEmpty()
      .withMessage("Project ID is required")
      .isMongoId()
      .withMessage("Invalid ProjectId"),
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("assignedTo")
      .notEmpty()
      .withMessage("Assigned To is required")
      .isMongoId()
      .withMessage("Invalid user ID for Assigned To"),
    body("assignedBy")
      .notEmpty()
      .withMessage("Assigned By is required")
      .isMongoId()
      .withMessage("Invalid user ID for Assigned By"),
  ];
};

export { createTaskValidator };
