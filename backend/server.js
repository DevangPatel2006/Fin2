import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from './routes/transactionRoutes.js';
import goalRoutes from './routes/goalRoutes.js'; // Add this
import chatRoutes from "./routes/chatRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
// ...


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes); // Add this

app.use("/api/chat", chatRoutes);
app.get("/", (req, res) => {
  res.send("API running successfully");
});
app.use("/api/ai", aiRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));