import express from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { 
  getUserAchievements, 
  getUserStats,
  checkAndUnlockAchievements,
  Achievement 
} from "../utils/dataStore";

const router = express.Router();

// Get all achievements for user
router.get("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const achievements = getUserAchievements(userId);
    
    // Sort by unlock date (newest first)
    achievements.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
    
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching achievements" });
  }
});

// Get user stats
router.get("/stats", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const stats = getUserStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats" });
  }
});

// Check and unlock new achievements
router.post("/check", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const newAchievements = checkAndUnlockAchievements(userId);
    
    res.json({
      newAchievements,
      message: newAchievements.length > 0 
        ? `Unlocked ${newAchievements.length} new achievement(s)!`
        : "No new achievements unlocked"
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking achievements" });
  }
});

export { router as achievementRoutes };