import { body } from "express-validator";

const createProjectValidator = () => {
  return [
    body("name")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Project name is required"),
    body("description").optional().trim(),
  ];
};

export { createProjectValidator };
