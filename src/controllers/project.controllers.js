import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import {
  AvailableUserRoles,
  UserRolesEnum,
} from "../utils/constants/constants.js";
import { User } from "../models/user.models.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.findOne({
    createdBy: new mongoose.Types.ObjectId(`${req?.user?._id}`),
  });
  if (!projects) {
    throw new ApiError(404, "No projects created");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, projects, "projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "projectId is required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Invalid projectId");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "project data fetched successfully"));
});

//creates a new project and adds the creator as a member with admin role
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const creatorId = new mongoose.Types.ObjectId(`${req.user._id}`);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const project = await Project.create(
      [
        {
          name,
          description,
          createdBy: creatorId,
        },
      ],
      { session },
    );
    if (!project || project.length === 0) {
      throw new ApiError(500, "Failed to create project");
    }

    await ProjectMember.create(
      [
        {
          user: creatorId,
          project: project[0]._id,
          role: UserRolesEnum.PROJECT_ADMIN,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return res
      .status(201)
      .json(new ApiResponse(201, project, "Project created"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error ?? "Failed to create project");
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { name, description },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

// Deletes a project and its associated members
const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const project = await Project.findByIdAndDelete(projectId, { session });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await ProjectMember.deleteMany(
      { project: new mongoose.Types.ObjectId(`${projectId}`) },
      { session },
    );
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Project deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error ?? "Failed to delete project");
  }
});

const addProjectToMember = asyncHandler(async (req, res) => {
  const { user: userId, role } = req.body;
  const { projectId } = req.params;

  const userIdObject = new mongoose.Types.ObjectId(`${userId}`);
  const projectIdObject = new mongoose.Types.ObjectId(`${projectId}`);

  const project = await Project.findById(projectIdObject);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const user = await User.findById(userIdObject);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!AvailableUserRoles.includes(role)) {
    throw new ApiError(400, "Invalid role provided");
  }

  const isRoleAlreadyAssigned = await ProjectMember.findOne({
    user: userIdObject,
    project: projectIdObject,
  });
  if (isRoleAlreadyAssigned) {
    throw new ApiError(409, "User already assigned to project");
  }

  const projectMember = await ProjectMember.create({
    user: userId,
    project: projectId,
    role,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, projectMember, "User added to project"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectMembers = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(`${projectId}`),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$createdBy",
      },
    },
    {
      $lookup: {
        from: "projectmembers",
        localField: "_id",
        foreignField: "project",
        as: "projectmembers",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$user",
          },
        ],
      },
    },
  ]);

  if (!projectMembers || projectMembers.length === 0) {
    throw new ApiError(404, "No members found for this project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projectMembers[0], "Project members fetched"));
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const { role } = req.body;

  const projectMember = await ProjectMember.findOneAndUpdate(
    {
      project: new mongoose.Types.ObjectId(`${projectId}`),
      user: new mongoose.Types.ObjectId(`${memberId}`),
    },
    { role },
    { new: true },
  );

  if (!projectMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projectMember, "Project member role updated"));
});

const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  const projectMember = await ProjectMember.findOneAndDelete({
    project: projectId,
    user: memberId,
  });

  if (!projectMember) {
    throw new ApiError(404, "Project member not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project member deleted"));
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectToMember,
  getProjectMembers,
  updateProjectMembers,
  updateMemberRole,
  deleteMember,
};
