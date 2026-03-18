import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cron from "node-cron";


import authRoute from "./routes/auth.js";
import activityRoutes from "./routes/activity.js";
import activityLogRoutes from "./routes/activityLog.js";
import reminderRoutes from "./routes/reminder.js";
import todayGoalRoutes from "./routes/todayGoal.js";
import journalRoutes from "./routes/journal.js";
import moodRoutes from "./routes/mood.js";
import chatbotRoute from "./routes/chatbot.js";  // ✅ NEW
import notificationsRoute from "./routes/notifications.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import User from "./models/user.js";
import TodayGoal from "./models/todayGoal.js";
import Activity from "./models/activity.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";





dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/activities", activityRoutes);
app.use("/api/activity-log", activityLogRoutes);
app.use("/api/reminder", reminderRoutes);
app.use("/api/today-goal", todayGoalRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/chatbot", chatbotRoute);  // ✅ SEPARATED CHATBOT ROUTE
app.use("/api/recommend", recommendationRoutes);

app.use("/api/dashboard", dashboardRoutes);





app.use("/api/notifications", notificationsRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.message || "Something went wrong!";
  res.status(status).json({
    success: false,
    status,
    message: msg,
    stack: err.stack,
  });
});

// ✅ MongoDB Connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected!");
});

// ✅ Start server
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // ✅ CRON JOB: Auto-create TodayGoal at midnight (00:00)
    cron.schedule("0 0 * * *", async () => {
      console.log("⏰ Running midnight job...");

      const today = new Date().toISOString().slice(0, 10);
      const users = await User.find();

      for (const user of users) {
        const exists = await TodayGoal.findOne({ userId: user._id, date: today });
        if (exists) continue;

        const randomActivity = await Activity.aggregate([{ $sample: { size: 1 } }]);

        if (randomActivity.length > 0) {
          await TodayGoal.create({
            userId: user._id,
            date: today,
            activityId: randomActivity[0]._id,
          });
          console.log(`✅ TodayGoal created for: ${user._id}`);
        }
      }

      console.log("🎉 Midnight goal assignment completed.");
    });
  });
});
