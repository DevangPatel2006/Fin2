import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import taxRoutes from "./routes/taxRoutes.js"; // NEW
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tax", taxRoutes); // NEW

// ADD THIS ROUTE:
app.use("/api/settings", settingsRoutes);
app.get("/", (req, res) => {
  res.send("API running successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));