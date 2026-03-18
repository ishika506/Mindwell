// routes/mood.js
import express from "express";
import { saveMood, getTodayMood} from "../controllers/moodController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ POST → save mood quiz result
router.post("/", verifyToken, saveMood);

// ✅ GET → fetch today's mood (optional for dashboard)
router.get("/today", verifyToken, getTodayMood);

export default router;
