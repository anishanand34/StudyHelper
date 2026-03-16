import Subject from "../models/subject.models.js";

// GET /api/v1/subjects — fetch all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: 1 });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

// POST /api/v1/subjects — create a new subject
export const createSubject = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: "Subject name is required" });
    }
    const subject = await Subject.create({
      name: name.trim(),
      icon: icon || "📖",
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: "Failed to create subject" });
  }
};

// DELETE /api/v1/subjects/:id — remove a subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.status(200).json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete subject" });
  }
};