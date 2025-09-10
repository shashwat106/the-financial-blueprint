import express from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { 
  getUserSavingsGoals, 
  saveSavingsGoal, 
  updateSavingsGoal, 
  deleteSavingsGoal,
  SavingsGoal 
} from "../utils/dataStore";

const router = express.Router();

// Get all savings goals for user
router.get("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const goals = getUserSavingsGoals(userId);
    
    // Add progress calculations
    const goalsWithProgress = goals.map(goal => {
      const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
      const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
      
      return {
        ...goal,
        progress: Math.min(100, progress),
        remaining,
        daysLeft,
        isCompleted: progress >= 100
      };
    });
    
    res.json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching savings goals" });
  }
});

// Create new savings goal
router.post("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const { name, description, targetAmount, currentAmount = 0, deadline, category, priority = "medium" } = req.body;

    if (!name || !targetAmount || !deadline || !category) {
      return res.status(400).json({ message: "Name, target amount, deadline, and category are required" });
    }

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      userId,
      name,
      description: description || "",
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline,
      category,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveSavingsGoal(goal);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Error creating savings goal" });
  }
});

// Update savings goal
router.put("/:id", (req: AuthenticatedRequest, res) => {
  try {
    const goalId = req.params.id;
    const { name, description, targetAmount, currentAmount, deadline, category, priority } = req.body;
    
    const updates = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(targetAmount && { targetAmount: parseFloat(targetAmount) }),
      ...(currentAmount !== undefined && { currentAmount: parseFloat(currentAmount) }),
      ...(deadline && { deadline }),
      ...(category && { category }),
      ...(priority && { priority })
    };

    updateSavingsGoal(goalId, updates);
    res.json({ message: "Savings goal updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating savings goal" });
  }
});

// Delete savings goal
router.delete("/:id", (req: AuthenticatedRequest, res) => {
  try {
    const goalId = req.params.id;
    deleteSavingsGoal(goalId);
    res.json({ message: "Savings goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting savings goal" });
  }
});

// Add money to savings goal
router.post("/:id/add", (req: AuthenticatedRequest, res) => {
  try {
    const goalId = req.params.id;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }
    
    const goals = getUserSavingsGoals(req.userId!);
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }
    
    const newAmount = goal.currentAmount + parseFloat(amount);
    updateSavingsGoal(goalId, { currentAmount: newAmount });
    
    res.json({ message: "Amount added successfully", newAmount });
  } catch (error) {
    res.status(500).json({ message: "Error adding to savings goal" });
  }
});

export { router as savingsGoalRoutes };