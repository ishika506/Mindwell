import express from "express";
import { createReminder, getUserReminders, updateReminder, deleteReminder } from "../controllers/reminder.js";

const router = express.Router();

// Create a new reminder
router.post("/", createReminder);

// Get all reminders for the logged-in user
router.get("/", getUserReminders);

// Update a reminder by ID
router.patch("/:id", updateReminder);

// Delete a reminder by ID
router.delete("/:id", deleteReminder);

export default router;
