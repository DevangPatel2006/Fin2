import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use by another account" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Delete user and all related data
    await User.findByIdAndDelete(userId);
    
    // Import models dynamically to delete related data
    const Transaction = (await import("../models/transactionModel.js")).default;
    const Goal = (await import("../models/goalModel.js")).default;
    
    await Transaction.deleteMany({ userId });
    await Goal.deleteMany({ userId });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};