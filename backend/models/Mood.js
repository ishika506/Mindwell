import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
   score: {
    type: Number,         // ✅ <-- ADD THIS
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString("en-IN"),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Mood", moodSchema);
