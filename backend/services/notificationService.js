import User from "../models/user.js";
import Goal from "../models/todayGoal.js";
import Mood from "../models/Mood.js";
import { personalizedMessages } from "../utils/personalizedMessages.js";
import moment from "moment";

export const generateNotification = async (userId) => {
  const now = moment().format("HH:mm");

  const user = await User.findById(userId).select("lastNotificationTime");
  const goals = await Goal.find({ userId, completed: false });
  const latestMood = await Mood.findOne({ userId }).sort({ createdAt: -1 });

  let notifications = [];

  // ⏰ Smart DAILY timed notifications
  if (!user.lastNotificationTime || moment().diff(moment(user.lastNotificationTime), "hours") >= 4) {
    notifications.push({
      type: "daily_checkin",
      message:
        personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)]
    });
  }

  // 🎯 Goal reminders
  if (goals.length > 0) {
    notifications.push({
      type: "goals",
      message: `Reminder: You still have ${goals.length} goals pending. Want to complete one now?`
    });
  }

  // 😊 Mood-based notification
  if (latestMood) {
    if (latestMood.score < 4) {
      notifications.push({
        type: "mood_support",
        message: "You seem low lately. Want to talk or journal a bit? I’m here ❤️"
      });
    } else if (latestMood.score > 7) {
      notifications.push({
        type: "boost",
        message: "You're doing amazing! Capture this good mood in your journal ✨"
      });
    }
  }

  // 🧠 Mood quiz reminder (if not taken today)
  if (!latestMood || !moment(latestMood.createdAt).isSame(moment(), "day")) {
    notifications.push({
      type: "quiz",
      message: "Take today’s 10-second mood quiz 😊"
    });
  }

  await User.findByIdAndUpdate(userId, { lastNotificationTime: new Date() });

  return notifications;
};
