// controllers/activity.js
import Activity from "../models/activity.js";

// Get all activities
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find({});
    res.json({ success: true, activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create new activity
export const createActivity = async (req, res) => {
  try {
    const { name, description, durationMinutes, category } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const activity = await Activity.create({ name, description, durationMinutes, category });
    res.status(201).json({ success: true, activity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
