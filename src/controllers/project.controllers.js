import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

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

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const creatorId = new mongoose.Types.ObjectId(`${req.user._id}`);

  const project = await Project.create({
    name,
    description,
    createdBy: creatorId,
  });

  if (!project) {
    throw new ApiError(500, "Failed to create project. Try again");
  }

  return res.status(201).json(new ApiResponse(201, project, "Project created"));
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

const deleteProject = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const addProjectToMember = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
});

const deleteMember = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  console.log("registerUser");
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
