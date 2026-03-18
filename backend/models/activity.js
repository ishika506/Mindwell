import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },           // e.g., "Deep Breathing"
  description: { type: String },                    // optional description
  durationMinutes: { type: Number },               // optional, e.g., 5
  category: { type: String },                       // e.g., "meditation", "movement"
}, { timestamps: true });                           // adds createdAt and updatedAt

export default mongoose.model("Activity", activitySchema);
