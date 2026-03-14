import express from "express";
import {
  getAllTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createTask);
router.patch("/:id/toggle", toggleTask);
router.delete("/:id", deleteTask);

export default router;