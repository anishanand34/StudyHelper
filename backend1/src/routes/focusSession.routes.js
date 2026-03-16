import express from "express";
import {
  getTodaySessions,
  createSession,
  cleanupOldSessions,
  getWeeklyFocusTime,
} from "../controllers/focusSession.controller.js";

const router = express.Router();

router.get("/",          getTodaySessions);
router.get("/weekly",  getWeeklyFocusTime);
router.post("/",         createSession);
router.delete("/cleanup", cleanupOldSessions);

export default router;