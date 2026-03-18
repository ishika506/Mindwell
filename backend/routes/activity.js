// routes/activity.js
import express from "express";
import { getAllActivities, createActivity } from "../controllers/activity.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/",verifyToken, getAllActivities);
router.post("/", createActivity);

export default router;
