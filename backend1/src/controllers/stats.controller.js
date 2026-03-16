import Stats from "../models/stats.models.js";
import { getThisMonday } from "../models/stats.models.js";

// helper used by task controller — gets or creates the single stats document
// also auto-resets weekly count if a new Monday has started
export const getOrCreateStats = async () => {
  let stats = await Stats.findOne();

  if (!stats) {
    // first time — create the stats document
    stats = await Stats.create({});
    return stats;
  }

  // check if we've crossed into a new Monday since last update
  const thisMonday = getThisMonday();
  if (stats.weekStartDate < thisMonday) {
    stats.weeklyTasksDone = 0;
    stats.weekStartDate = thisMonday;
    await stats.save();
  }

  return stats;
};

// GET /api/v1/stats — fetch stats for profile/dashboard
export const getStats = async (req, res) => {
  try {
    const stats = await getOrCreateStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};