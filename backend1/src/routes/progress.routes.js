import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getProgress, addQuizEntry, addAIQuizEntry, deleteQuizEntry } from "../controllers/progress.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getProgress);
router.post("/add", addQuizEntry);
router.post("/add-ai", addAIQuizEntry);
router.delete("/delete/:entryId", deleteQuizEntry);

export default router;