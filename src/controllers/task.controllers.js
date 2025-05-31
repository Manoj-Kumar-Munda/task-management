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

export { createTask };
