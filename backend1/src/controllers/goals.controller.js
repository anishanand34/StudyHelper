import Goals from "../models/goals.models.js";

// GET /api/v1/goals
export const getGoals = async (req, res) => {
  try {
    let goals = await Goals.findOne();
    if (!goals) goals = await Goals.create({});
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// POST /api/v1/goals — create or overwrite
export const saveGoals = async (req, res) => {
  try {
    const { dailyStudyHours, weeklyStudyHours, weeklyTasksCompleted, weeklySubjectsCovered } = req.body;
    let goals = await Goals.findOne();
    if (!goals) {
      goals = await Goals.create({ dailyStudyHours, weeklyStudyHours, weeklyTasksCompleted, weeklySubjectsCovered });
    } else {
      goals.dailyStudyHours       = dailyStudyHours       ?? goals.dailyStudyHours;
      goals.weeklyStudyHours      = weeklyStudyHours      ?? goals.weeklyStudyHours;
      goals.weeklyTasksCompleted  = weeklyTasksCompleted  ?? goals.weeklyTasksCompleted;
      goals.weeklySubjectsCovered = weeklySubjectsCovered ?? goals.weeklySubjectsCovered;
      await goals.save();
    }
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to save goals" });
  }
};