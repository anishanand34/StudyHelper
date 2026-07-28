import express from "express";
import {
  getAllSubjects,
  createSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // 👈 import your auth middleware

const router = express.Router();

router.get("/", verifyJWT, getAllSubjects);       // 👈 add authMiddleware
router.post("/", verifyJWT, createSubject);      // 👈 add authMiddleware
router.delete("/:id", verifyJWT, deleteSubject); // 👈 add authMiddleware

export default router;