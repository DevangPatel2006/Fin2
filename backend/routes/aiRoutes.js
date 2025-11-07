import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAISummary, getAIScore, getAIRecommendations } from "../controllers/aiController.js";

const router = express.Router();

router.get("/summary", protect, getAISummary);
router.get("/score", protect, getAIScore);
router.get("/recommendations", protect, getAIRecommendations);

export default router;
