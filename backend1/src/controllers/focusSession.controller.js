import FocusSession from "../models/focusSession.models.js";

// helper — returns today's date as "YYYY-MM-DD" in local time
const getTodayDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// GET /api/v1/focus — fetch only today's sessions
export const getTodaySessions = async (req, res) => {
  try {
    const today = getTodayDate();
    const sessions = await FocusSession.find({ date: today }).sort({ createdAt: 1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// POST /api/v1/focus — save a completed session
export const createSession = async (req, res) => {
  try {
    const { subjectId, subjectName, subjectIcon, duration } = req.body;

    if (!subjectId || !subjectName || !duration) {
      return res.status(400).json({ error: "subjectId, subjectName and duration are required" });
    }
    if (duration < 1) {
      return res.status(400).json({ error: "Session must be at least 1 second" });
    }

    const session = await FocusSession.create({
      subjectId,
      subjectName,
      subjectIcon: subjectIcon || "📖",
      duration,
      date: getTodayDate(),
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to save session" });
  }
};

// DELETE /api/v1/focus/cleanup — removes all sessions older than today
// optional utility — call manually or on a cron if needed
export const cleanupOldSessions = async (req, res) => {
  try {
    const today = getTodayDate();
    const result = await FocusSession.deleteMany({ date: { $lt: today } });
    res.status(200).json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to cleanup sessions" });
  }
};

// GET /api/v1/focus/weekly — total focus seconds for this Monday–Sunday week
export const getWeeklyFocusTime = async (req, res) => {
  try {
    // get this Monday at midnight
    const now  = new Date();
    const day  = now.getDay(); // 0=Sun, 1=Mon...
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    // get next Monday at midnight
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    const sessions = await FocusSession.find({
      createdAt: { $gte: monday, $lt: nextMonday },
    });

    const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
    const uniqueSubjects = new Set(
      sessions.map((s) => s.subjectId.toString())
    ).size;

    res.status(200).json({ totalSeconds, uniqueSubjects });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weekly focus time" });
  }
}