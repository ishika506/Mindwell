// models/activityLog.js
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  completed: { type: Boolean, default: true },
}, { timestamps: true });

// Prevent duplicate logs
activityLogSchema.index({ userId: 1, activityId: 1, date: 1 }, { unique: true });

export default mongoose.model("ActivityLog", activityLogSchema);
