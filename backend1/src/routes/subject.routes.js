import express from "express";
import {
  getAllSubjects,
  createSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

const router = express.Router();

router.get("/", getAllSubjects);
router.post("/", createSubject);
router.delete("/:id", deleteSubject);

export default router;