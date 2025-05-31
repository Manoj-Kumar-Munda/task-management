import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  let attachmentUrls = [];
  if (req.files && req.files.length > 0) {
    const attachmentLocalUrls = req.files.map((file) => file.path);
    attachmentUrls = await Promise.all(
      attachmentLocalUrls.map(async (url) => {
        return await uploadOnCloudinary(url);
      }),
    );
  }

  if (attachmentUrls?.length === 0) {
    throw new ApiError(400, "Failed to upload attachments. Please try again.");
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user._id,
    project: projectId,
    attachments: attachmentUrls,
  });

  if (!task) {
    throw new ApiError(500, "Failed to create task");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { task }, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      assignedTo,
    },
    {
      new: true,
    },
  );

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateTask, "Task updated successfully"));
});

const updateStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { status },
    { new: true },
  );

  if (!updatedTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task status updated successfully"),
    );
});

const getTasksByProjectId = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const tasks = await Task.find({ project: projectId });

  if (!tasks || tasks.length === 0) {
    throw new ApiError(404, "No tasks found for this project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task retrieved successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deletedTask) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

export {
  createTask,
  updateTask,
  updateStatus,
  getTasksByProjectId,
  getTaskById,
  deleteTask,
};
