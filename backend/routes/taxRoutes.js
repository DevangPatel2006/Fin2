// backend/routes/taxRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { analyzeTaxSavings } from "../controllers/taxController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeTaxSavings);

export default router;