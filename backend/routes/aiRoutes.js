import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAISummary, getAIScore, getAIRecommendations } from "../controllers/aiController.js";
import { getUserInsights } from "../controllers/insightsController.js";

const router = express.Router();

router.get("/summary", protect, getAISummary);
router.get("/score", protect, getAIScore);
router.get("/recommendations", protect, getAIRecommendations);
router.get("/insights", protect, getUserInsights); // NEW ENDPOINT

export default router;