import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    subjectIcon: {
      type: String,
      default: "📖",
    },
    duration: {
      type: Number, // stored in seconds
      required: true,
    },
    date: {
      type: String, // stored as "YYYY-MM-DD" for easy daily filtering
      required: true,
    },
  },
  { timestamps: true }
);

const FocusSession = mongoose.model("FocusSession", focusSessionSchema);
export default FocusSession;