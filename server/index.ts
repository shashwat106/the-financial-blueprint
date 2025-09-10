import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { handleDemo } from "./routes/demo";
import { handleNews } from "./routes/news";
import { authRoutes } from "./routes/auth";
import { expenseRoutes } from "./routes/expenses";
import { budgetRoutes } from "./routes/budgets";
import { savingsGoalRoutes } from "./routes/savingsGoals";
import { achievementRoutes } from "./routes/achievements";
import { policyRoutes } from "./routes/policies";
import { userDataRoutes } from "./routes/user-data";
import { authenticateToken } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/news", handleNews);
  app.get("/api/news", handleNews);

  // Authentication routes
  app.use("/api/auth", authRoutes);
  
  // Protected routes
  app.use("/api/expenses", authenticateToken, expenseRoutes);
  app.use("/api/budgets", authenticateToken, budgetRoutes);
  app.use("/api/savings-goals", authenticateToken, savingsGoalRoutes);
  app.use("/api/achievements", authenticateToken, achievementRoutes);
  app.use("/api/user-data", authenticateToken, userDataRoutes);
  app.use("/api/policies", policyRoutes);

  return app;
}
