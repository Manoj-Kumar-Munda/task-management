import { body, oneOf } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("username should be at least 3 characters long")
      .isLength({ max: 13 })
      .withMessage("username cannot exceed 13 characters"),
    body("password").notEmpty().withMessage("Password is required"),
    body("fullName").notEmpty().trim().withMessage("Full name is required"),
    body("avatar.url").optional().isURL().withMessage("Avatar URL is invalid"),
    body("avatar.localpath")
      .optional()
      .isString()
      .withMessage("localpath is invalid"),
  ];
};

const userLoginValidator = () => {
  return [
    body("userId")
      .trim()
      .notEmpty()
      .withMessage("Email or username is required"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ];
};

const resendVerficationValidator = () => {
  return [
    oneOf([
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
      body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLength({ min: 3 })
        .withMessage("username should be at least 3 characters long")
        .isLength({ max: 13 })
        .withMessage("username cannot exceed 13 characters"),
    ]),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const changePasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

export {
  userRegistrationValidator,
  userLoginValidator,
  resendVerficationValidator,
  forgotPasswordValidator,
  changePasswordValidator,
};
