// routes/todayGoal.js
import express from "express";
import { getTodayGoal, completeTodayGoal } from "../controllers/todayGoal.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getTodayGoal);             // Get or generate today's goal
router.post("/complete", verifyToken, completeTodayGoal); // Mark goal as completed

export default router;
