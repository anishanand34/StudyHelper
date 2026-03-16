import express from "express";
import { getGoals, saveGoals } from "../controllers/goals.controller.js";

const router = express.Router();

router.get("/",  getGoals);
router.post("/", saveGoals);

export default router;