// routes/chatbotRoutes.js
import express from "express";
import { chatWithAI } from "../controllers/chatbotController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST → send message to AI + update daily summary
router.post("/chat", verifyToken, chatWithAI);

export default router;
