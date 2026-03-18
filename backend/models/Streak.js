// models/Streak.js
import mongoose from "mongoose";

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Mood streak → number of consecutive days user logged mood
    moodStreak: {
      type: Number,
      default: 0,
    },

    // Daily goal streak → consecutive days completed all 4 tasks
    goalStreak: {
      type: Number,
      default: 0,
    },

    // This "unified streak" is for weekly report if needed
    currentStreak: {
      type: Number,
      default: 0,
    },

    // Track last date user updated streak to avoid double-counting
    lastUpdated: {
      type: String, // formatted "YYYY-MM-DD"
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Streak", streakSchema);
