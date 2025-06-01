import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { Subtask } from "../models/subtask.models.js";
import { Task } from "../models/task.models.js";

const getAllSubTasks = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  const subtasks = await Subtask.find({
    task: new mongoose.Types.ObjectId(`${taskId}`),
  });

  if (!subtasks || subtasks.length === 0) {
    throw new ApiError(404, "No subtasks found for this task");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtasks, "Subtasks retrieved successfully"));
});

const createSubtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: taskId,
    isCompleted: false,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { subtask }, "Subtask created successfully"));
});

const updateSubtask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { title, isCompleted = false } = req.body;

  const subtask = await Subtask.findByIdAndUpdate(
    subtaskId,
    { title, isCompleted },
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { subtask }, "Subtask updated successfully"));
});

const updateSubtaskCompletion = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const { isCompleted } = req.body;

  const subtask = await Subtask.findByIdAndUpdate(
    subtaskId,
    { isCompleted },
    { new: true },
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { subtask }, "Subtask updated successfully"));
});

const deleteSubtask = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;

  const deletedSubtask = await Subtask.findByIdAndDelete(subtaskId);
  if (!deletedSubtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subtask: deletedSubtask },
        "Subtask deleted successfully",
      ),
    );
});

export {
  createSubtask,
  updateSubtask,
  deleteSubtask,
  updateSubtaskCompletion,
  getAllSubTasks,
};
