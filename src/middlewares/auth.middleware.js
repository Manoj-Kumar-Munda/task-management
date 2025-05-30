import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken -emailVerificationToken",
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }
  req.user = user;
  next();
});

export const validateProjectPermissions = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const user = req.user;

    if (!projectId) {
      throw new ApiError(400, "Project ID is required");
    }

    const project = await ProjectMember.findOne({
      project: projectId,
      user: user._id,
    });

    if (!project) {
      throw new ApiError(
        403,
        "Forbidden: You do not have permission to access this project",
      );
    }

    const givenRole = project.role;

    req.user.role = givenRole;
    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        `You don't have permission to perform this action`,
      );
    }

    next();
  });
