import { Progress } from "../models/progress.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Get all progress for user
export const getProgress = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({ user: req.user._id });
  if (!progress) {
    progress = await Progress.create({ user: req.user._id, quizzes: [] });
  }
  return res.status(200).json(new ApiResponse(200, progress, "Progress fetched"));
});

// Add a quiz entry manually
export const addQuizEntry = asyncHandler(async (req, res) => {
  const { subject, topic, score, totalMarks, notes } = req.body;
  if (!subject || !topic || score === undefined || !totalMarks) {
    throw new ApiError(400, "All fields are required");
  }

  let progress = await Progress.findOne({ user: req.user._id });
  if (!progress) {
    progress = await Progress.create({ user: req.user._id, quizzes: [] });
  }

  progress.quizzes.push({ subject, topic, score, totalMarks, source: "manual", notes });
  await progress.save();

  return res.status(200).json(new ApiResponse(200, progress, "Quiz entry added"));
});

// Add quiz from AI session (called from chat controller)
export const addAIQuizEntry = asyncHandler(async (req, res) => {
  const { subject, topic, score, totalMarks } = req.body;

  let progress = await Progress.findOne({ user: req.user._id });
  if (!progress) {
    progress = await Progress.create({ user: req.user._id, quizzes: [] });
  }

  progress.quizzes.push({ subject, topic, score, totalMarks, source: "ai" });
  await progress.save();

  return res.status(200).json(new ApiResponse(200, progress, "AI quiz entry saved"));
});

// Delete a quiz entry
export const deleteQuizEntry = asyncHandler(async (req, res) => {
  const { entryId } = req.params;
  const progress = await Progress.findOne({ user: req.user._id });
  if (!progress) throw new ApiError(404, "Progress not found");

  progress.quizzes = progress.quizzes.filter(q => q._id.toString() !== entryId);
  await progress.save();

  return res.status(200).json(new ApiResponse(200, progress, "Entry deleted"));
});