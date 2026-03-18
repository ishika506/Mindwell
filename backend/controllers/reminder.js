import Reminder from '../models/reminder.js'

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId, time, method } = req.body;

    if (!time) return res.status(400).json({ message: "Reminder time is required" });

    const reminder = await Reminder.create({ userId, activityId, time, method });
    res.status(201).json({ success: true, reminder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reminders for the logged-in user
export const getUserReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.find({ userId }).populate("activityId");
    res.json({ success: true, reminders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const reminder = await Reminder.findByIdAndUpdate(id, updates, { new: true });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    res.json({ success: true, reminder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findByIdAndDelete(id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    res.json({ success: true, message: "Reminder deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
