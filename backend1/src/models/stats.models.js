import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    totalTasksDone: {
      type: Number,
      default: 0,
    },
    weeklyTasksDone: {
      type: Number,
      default: 0,
    },
    weekStartDate: {
      type: Date,
      default: () => getThisMonday(),
    },
  },
  { timestamps: true }
);

// helper — returns the date of the most recent Monday at midnight
function getThisMonday() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // go back to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const Stats = mongoose.model("Stats", statsSchema);
export default Stats;
export { getThisMonday };