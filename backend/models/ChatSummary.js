// models/ChatSummary.js
import mongoose from "mongoose";

const ChatSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure only ONE summary per user per day
ChatSummarySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("ChatSummary", ChatSummarySchema);
