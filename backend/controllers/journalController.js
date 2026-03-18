

import Journal from "../models/journal.js";
import TodayGoal from "../models/todayGoal.js";

export const addJournal = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    // ✅ Check if journal already exists for today
    const existing = await Journal.findOne({ userId, date: today });
    if (existing) {
      return res.status(400).json({ message: "Journal already added for today" });
    }

    // ✅ Save journal
    const journal = new Journal({ userId, date: today, content });
    await journal.save();

    // ✅ Mark journalCompleted = true in TodayGoal
    await TodayGoal.findOneAndUpdate(
      { userId, date: today },
      { journalCompleted: true },
      { new: true }
    );

    res.status(201).json({ message: "Journal added & TodayGoal updated", journal });

  } catch (error) {
    console.error("Error adding journal:", error);
    res.status(500).json({ message: "Failed to add journal", error });
  }
};

// GET: Fetch all journals for a user
export const getJournals = async (req, res) => {
  try {
    const { userId } = req.params;
    const journals = await Journal.find({ userId }).sort({ date: -1 });

    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch journals", error });
  }
};

// GET: Fetch journal of a specific date
export const getJournalByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const journal = await Journal.findOne({ userId, date });

    if (!journal) return res.status(404).json({ message: "No journal found" });

    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: "Error fetching journal", error });
  }
};
