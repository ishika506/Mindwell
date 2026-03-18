// controllers/todayGoal.js
import TodayGoal from "../models/todayGoal.js";
import Activity from "../models/activity.js";
import moment from "moment";

// ✅ Get or generate today's goal
export const getTodayGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format("YYYY-MM-DD");

    let goal = await TodayGoal.findOne({ userId, date: today });

    // ✅ Assign random activity if not assigned
    if (!goal || !goal.activityId) {
      const randomActivity = await Activity.aggregate([{ $sample: { size: 1 } }]);
      if (randomActivity.length === 0)
        return res.status(400).json({ success: false, message: "No activities found" });

      if (!goal) {
        goal = await TodayGoal.create({
          userId,
          date: today,
          activityId: randomActivity[0]._id,
          activityCompleted: false,
          journalCompleted: false,
          quizCompleted: false,
          chatCompleted: false,
        });
      } else {
        goal.activityId = randomActivity[0]._id;
        await goal.save();
      }
    }

    // ✅ Populate activity
    await goal.populate("activityId");

    res.status(200).json({
      success: true,
      goal: {
        activity: {
          name: goal.activityId?.name || "Random Activity",
          description: goal.activityId?.description || "Complete this activity today.",
          completed: goal.activityCompleted,
        },
        journal: {
          name: "Write your daily journal",
          description: "Reflect on your day and write down your thoughts",
          completed: goal.journalCompleted,
        },
        quiz: {
          name: "Mood Quiz",
          description: "Answer mood questions to track emotional state",
          completed: goal.quizCompleted,
        },
        chat: {
          name: "Talk to AI",
          description: "Send at least one message to MindWell",
          completed: goal.chatCompleted,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Mark today's goal as completed (activity or chat)
export const completeTodayGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, activityId } = req.body; // type: "activity" or "chat"
    const today = moment().format("YYYY-MM-DD");

    const goal = await TodayGoal.findOne({ userId, date: today });

    if (!goal)
      return res.status(404).json({ success: false, message: "Goal not found" });

    if (type === "activity") {
      if (!activityId || goal.activityId.toString() !== activityId) {
        return res.status(400).json({
          success: false,
          message: "This is not the assigned activity for today's goal.",
        });
      }
      goal.activityCompleted = true;
    } else if (type === "chat") {
      goal.chatCompleted = true;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid completion type. Must be 'activity' or 'chat'.",
      });
    }

    await goal.save();

    res.json({
      success: true,
      message: `✅ ${type === "chat" ? "Chat" : "Activity"} completed for today's goal`,
      goal,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
