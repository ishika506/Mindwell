import TodayGoal from "../models/todayGoal.js";
import Mood from "../models/Mood.js";
import User from "../models/user.js";
import moment from "moment";
import Streak from "../models/Streak.js";

function getMoodTrend(logs) {
  if (!logs || logs.length < 2) return "stable";
  const first = logs[0].score ?? 0;
  const last = logs[logs.length - 1].score ?? 0;

  if (last > first) return "improving";
  if (last < first) return "declining";
  return "stable";
}

function calculateStreak(entries) {
  if (!entries || entries.length === 0) return 0;

  let streak = 1;
  for (let i = entries.length - 1; i > 0; i--) {
    const d1 = new Date(entries[i].date);
    const d2 = new Date(entries[i - 1].date);

    const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = moment().format("YYYY-MM-DD");

    const start = moment().startOf("day").utc().toDate();
    const end = moment().endOf("day").utc().toDate();

    // --------------------------
    // 1) Today's Mood
    // --------------------------
    const todayMoodDoc = await Mood.findOne({
      userId,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .lean();

    // If user logged mood => mark quiz completed
    if (todayMoodDoc) {
      await TodayGoal.findOneAndUpdate(
        { userId, date: todayStr },
        { quizCompleted: true },
        { upsert: true }
      );
    }

    // --------------------------
    // 2) Last 7 Moods
    // --------------------------
    const last7 = await Mood.find({ userId })
      .sort({ createdAt: -1 })
      .limit(7)
      .lean();
    last7.reverse();

    // --------------------------
    // 3) Mood Trend
    // --------------------------
    const moodTrend = getMoodTrend(last7);

    // --------------------------
    // 4) Mood Streak (dedup + sort)
    // --------------------------
    const allMoodLogs = await Mood.find({ userId })
      .sort({ createdAt: 1 })
      .lean();

    const uniqueDates = [
      ...new Set(
        allMoodLogs.map(m => moment(m.createdAt).format("YYYY-MM-DD"))
      )
    ].map(date => ({ date }));

    const moodStreak = calculateStreak(uniqueDates);

    // --------------------------
    // 5) Daily Goal Status
    // --------------------------
    let todayGoal = await TodayGoal.findOne({ userId, date: todayStr }).lean();

    if (!todayGoal) {
      todayGoal = await TodayGoal.create({
        userId,
        date: todayStr,
        activityCompleted: false,
        journalCompleted: false,
        quizCompleted: !!todayMoodDoc,
        chatCompleted: false,
      });
    }

    const dailyProgress = {
      activity: !!todayGoal.activityCompleted,
      journal: !!todayGoal.journalCompleted,
      quiz: !!todayGoal.quizCompleted,
      chat: !!todayGoal.chatCompleted,
      completedCount: [
        todayGoal.activityCompleted,
        todayGoal.journalCompleted,
        todayGoal.quizCompleted,
        todayGoal.chatCompleted,
      ].filter(Boolean).length,
    };

    // --------------------------
    // 6) GET FROM STREAK MODEL 🔥
    // --------------------------
    const streakDoc = await Streak.findOne({ userId }).lean();

    const currentStreak = streakDoc?.currentStreak || 0;
    const goalStreak = streakDoc?.goalStreak || 0;

    // --------------------------
    // 7) Suggestions Based on Trend
    // --------------------------
    let suggestions = [];

    if (moodTrend === "declining") {
      suggestions = [
        "Try a 5-minute grounding exercise.",
        "Write one thing that stressed you today.",
        "Take a slow mindful walk.",
      ];
    } else if (moodTrend === "improving") {
      suggestions = [
        "Great progress! Keep going!",
        "Write down something you're grateful for.",
        "Try a new healthy activity today.",
      ];
    } else {
      suggestions = [
        "Stay consistent—you’re doing good.",
        "Drink water & stretch your body.",
        "Reflect on one positive moment today.",
      ];
    }

    // --------------------------
    // 8) Quick Actions
    // --------------------------
    const quickActions = [
      { label: "Log Mood", route: "/quiz" },
      { label: "Write Journal", route: "/journal" },
      { label: "Start Chat", route: "/chat" },
    ];

    // --------------------------
    // 9) Motivational Line
    // --------------------------
    const phrases = [
      "You’re doing better than you think.",
      "Small steps count too — keep going.",
      "Your feelings are valid.",
      "One positive action can change your day.",
    ];

    const motivationalMessage =
      phrases[Math.floor(Math.random() * phrases.length)];

    // --------------------------
    // 10) Chart Data
    // --------------------------
    const last7MoodChart = last7.map(m => ({
      date: moment(m.createdAt).format("MMM DD"),
      score: m.score ?? 0,
    }));

    // --------------------------
    // 11) Return Dashboard
    // --------------------------
    const todayMood = todayMoodDoc
      ? {
          mood: todayMoodDoc.mood,
          note: todayMoodDoc.note,
          createdAt: todayMoodDoc.createdAt,
        }
      : null;

    return res.json({
      success: true,
      dashboard: {
        todayMood,
        moodTrend,
        last7MoodChart,
        progress: dailyProgress,
        streaks: {
          goalStreak,
          moodStreak,
          currentStreak,
        },
        suggestions,
        quickActions,
        motivationalMessage,
      },
    });
  } catch (err) {
    console.error("Dashboard Error →", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while loading dashboard",
    });
  }
};
