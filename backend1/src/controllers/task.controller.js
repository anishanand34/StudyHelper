import Task from "../models/task.models.js";

// GET /api/tasks — fetch all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// POST /api/tasks — create a new task
export const createTask = async (req, res) => {
  try {
    const { text, time } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }
    const task = await Task.create({ text: text.trim(), time: time || "Anytime" });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// PATCH /api/tasks/:id/toggle — flip done true/false
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    task.done = !task.done;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE /api/tasks/:id — remove a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};