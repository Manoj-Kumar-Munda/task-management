import { Project } from "../models/project.models";
import { Task } from "../models/task.models";

const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, assignedBy } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy,
    project: projectId,
  });

  res.status(201).json(task);
});

export { createTask };
