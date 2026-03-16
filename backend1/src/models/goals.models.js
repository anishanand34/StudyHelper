import mongoose from "mongoose";

const goalsSchema = new mongoose.Schema(
  {
    dailyStudyHours:       { type: Number, default: 4  },
    weeklyStudyHours:      { type: Number, default: 25 },
    weeklyTasksCompleted:  { type: Number, default: 12 },
    weeklySubjectsCovered: { type: Number, default: 5  },
  },
  { timestamps: true }
);

const Goals = mongoose.model("Goals", goalsSchema);
export default Goals;