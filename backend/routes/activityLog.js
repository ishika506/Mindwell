/// routes/activityLog.js
import express from "express";
import { markActivityDone, getAllLogs, getTodayLogs } from "../controllers/activityLog.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Mark today's activity as done
router.post("/", verifyToken, markActivityDone);

// Get all activity logs for user
router.get("/", verifyToken, getAllLogs);

// Get today's completed activities
router.get("/today", verifyToken, getTodayLogs);

export default router;
