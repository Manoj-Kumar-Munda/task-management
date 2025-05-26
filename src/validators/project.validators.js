import { body, param } from "express-validator";
import { AvailableUserRoles } from "../utils/constants/constants.js";

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

const addProjectToMemberValidator = () => {
  return [
    body("user")
      .trim()
      .notEmpty()
      .isString()
      .withMessage("User ID is required"),
    param("projectId").trim().notEmpty().withMessage("Project ID is required"),
    body("role")
      .isString()
      .withMessage("Role must be a string")
      .isIn(AvailableUserRoles)
      .withMessage("Invalid role"),
  ];
};

const updateMemberRoleValidator = () => {
  return [
    param("memberId").trim().notEmpty().withMessage("memberId is required"),
    param("projectId").trim().notEmpty().withMessage("rojectId is required"),
    body("role")
      .trim()
      .notEmpty()
      .withMessage("role is required")
      .isString()
      .withMessage("role must be a string")
      .isIn(AvailableUserRoles)
      .withMessage("Invalid role"),
  ];
};

export {
  createProjectValidator,
  addProjectToMemberValidator,
  updateMemberRoleValidator,
};
