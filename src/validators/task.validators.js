import { body, param } from "express-validator";
import { AvailableTaskStatus } from "../utils/constants/constants.js";

const createTaskValidator = () => {
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
    body("status")
      .optional()
      .trim()
      .isIn(AvailableTaskStatus)
      .withMessage(`Status must be one of: ${AvailableTaskStatus.join(", ")}`),
    body("attachments")
      .optional()
      .isArray()
      .withMessage("attachments must be an array")
      .custom((value) => {
        if (value.some((item) => typeof item !== "string")) {
          throw new Error("Invalid attatchment url");
        }
        return true;
      }),
  ];
};

export { createTaskValidator };
