import mongoose from "mongoose";

const quizEntrySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  source: { type: String, enum: ["manual", "ai"], default: "manual" },
  notes: { type: String, default: "" },
}, { timestamps: true });

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizzes: [quizEntrySchema],
}, { timestamps: true });

export const Progress = mongoose.model("Progress", progressSchema);