import Task from "../models/task.models.js";
import { getOrCreateStats } from "./stats.controller.js";

// GET /api/v1/tasks — fetch all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// POST /api/v1/tasks — create a new task
export const createTask = async (req, res) => {
  try {
    const { text, time } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }
    const task = await Task.create({
      text: text.trim(),
      time: time || "Anytime",
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// PATCH /api/v1/tasks/:id/toggle — flip done true/false + update stats
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const wasДone = task.done;
    task.done = !task.done;
    await task.save();

    // update stats based on direction of toggle
    const stats = await getOrCreateStats();
    if (!wasДone && task.done) {
      // just marked as done — increment
      stats.totalTasksDone += 1;
      stats.weeklyTasksDone += 1;
    } else if (wasДone && !task.done) {
      // just unmarked — decrement (never go below 0)
      stats.totalTasksDone = Math.max(0, stats.totalTasksDone - 1);
      stats.weeklyTasksDone = Math.max(0, stats.weeklyTasksDone - 1);
    }
    await stats.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// DELETE /api/v1/tasks/:id — remove task + decrement stats if it was done
// DELETE /api/v1/tasks/:id — remove task, never touch totalTasksDone
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // deleting a task never affects any stats
    // totalTasksDone and weeklyTasksDone are permanent until Monday reset or unmark
    
    res.status(200).json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
