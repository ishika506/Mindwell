// models/todayGoal.jsimport mongoose from "mongoose";
import mongoose from "mongoose";

const todayGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  activityCompleted: { type: Boolean, default: false },
   journalCompleted: { type: Boolean, default: false },
   quizCompleted: {
      type: Boolean,default: false, 
    },
chatCompleted: { type: Boolean, default: false },
}, { timestamps: true });

todayGoalSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("TodayGoal", todayGoalSchema);
