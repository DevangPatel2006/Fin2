import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfile, changePassword, deleteAccount } from "../controllers/settingsController.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
