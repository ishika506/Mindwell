import express from "express";
import { addJournal, getJournals, getJournalByDate } from "../controllers/journalController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addJournal);
router.get("/all/:userId", verifyToken, getJournals);
router.get("/:userId/:date", verifyToken, getJournalByDate);

export default router;
