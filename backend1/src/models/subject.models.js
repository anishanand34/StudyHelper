import mongoose from "mongoose";



const subjectSchema = new mongoose.Schema(
  {

      
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,        // 👈 ADD THIS
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "📖",
    },
    sessions: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;