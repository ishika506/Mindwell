import express from "express";
import { getNotifications } from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);

export default router;
