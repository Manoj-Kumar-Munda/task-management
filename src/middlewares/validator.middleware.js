import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";
import { ERROR_CODES } from "../utils/constants/error-codes.js";
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty) {
    return next();
  }

  throw new ApiError(
    422,
    "Received data is not valid",
    errors.array(),
    ERROR_CODES.AUTH.AUTH_VALIDATION_ERROR,
  );
};
