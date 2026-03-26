import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from 'compression';
import pinoHttp from 'pino-http';
import validateEnv from "./config/validateEnv.js";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";
import { authLimiter, chatLimiter, apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import taxRoutes from "./routes/taxRoutes.js"; // NEW
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
validateEnv();
connectDB();

const app = express();
app.use(cors());
app.use(compression());
app.use(pinoHttp({ logger }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    uptime: process.uptime(), 
    memory: process.memoryUsage(), 
    timestamp: Date.now() 
  });
});

app.use('/api', apiLimiter);
app.use("/api/auth", authLimiter, authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use("/api/chat", chatLimiter, chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tax", taxRoutes); // NEW

// ADD THIS ROUTE:
app.use("/api/settings", settingsRoutes);
app.get("/", (req, res) => {
  res.send("API running successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));