import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user._id,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(500, "Failed to create task");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { task }, "Task created successfully"));
});

export { createTask };
