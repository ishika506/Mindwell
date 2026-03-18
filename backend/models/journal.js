// models/Journal.js
import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // "2025-11-05"
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent multiple journals for same date
journalSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Journal || mongoose.model("Journal", journalSchema);
