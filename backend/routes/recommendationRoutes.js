import express from "express";
import { recommendMovies }  from "../controllers/recommendationController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/movies", verifyToken, recommendMovies);


export default router;
