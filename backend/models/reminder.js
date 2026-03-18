import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // optional: specific activity
  time: { type: String, required: true },                                // "HH:mm" format
  recurring: { type: Boolean, default: true },                           // daily or one-time
  method: { type: String, enum: ["email", "push", "in-app"], default: "in-app" },
}, { timestamps: true });                                                  // adds createdAt and updatedAt

export default mongoose.model("Reminder", reminderSchema);
