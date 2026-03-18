/// controllers/activityLog.js
import ActivityLog from "../models/activityLog.js";
import TodayGoal from "../models/todayGoal.js";

/**
 * Mark activity done (only updates TodayGoal if matched)
 */
export const markActivityDone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activityId } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    const todayGoal = await TodayGoal.findOne({ userId, date: today });

    if (!todayGoal) {
      return res.status(400).json({ message: "No activity goal assigned for today" });
    }

    const existingLog = await ActivityLog.findOne({ userId, activityId, date: today });
    if (existingLog) {
      return res.status(400).json({ message: "This activity is already logged today" });
    }

    const log = await ActivityLog.create({
      userId,
      activityId,
      date: today,
      completed: true,
    });

    let goalUpdated = false;

    if (todayGoal.activityId.toString() === activityId) {
      todayGoal.activityCompleted = true;   // ✅ only mark activity, not whole goal
      await todayGoal.save();
      goalUpdated = true;
    }

    res.status(201).json({
      success: true,
      message: goalUpdated
        ? "✅ Today's activity completed!"
        : "Activity completed but not the assigned daily goal.",
      log,
      todayGoal,
    });
  } catch (error) {
    console.error("Error in markActivityDone:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await ActivityLog.find({ userId })
      .populate("activityId")
      .sort({ date: -1 });

    res.json({ success: true, logs });
  } catch (error) {
    console.error("Error in getAllLogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get today's completed activities
 */
export const getTodayLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    const logs = await ActivityLog.find({ userId, date: today }).populate("activityId");

    res.json({ success: true, logs });
  } catch (error) {
    console.error("Error in getTodayLogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
