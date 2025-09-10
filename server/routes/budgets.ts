import express from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { 
  getUserBudgets, 
  saveBudget, 
  updateBudget, 
  deleteBudget,
  Budget,
  getUserExpenses
} from "../utils/dataStore";

const router = express.Router();

// Get all budgets for user
router.get("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const budgets = getUserBudgets(userId);
    const expenses = getUserExpenses(userId);
    
    // Calculate spent amounts for each budget
    const budgetsWithSpent = budgets.map(budget => {
      const categoryExpenses = expenses.filter(expense => 
        expense.category.toLowerCase() === budget.category.toLowerCase()
      );
      const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        ...budget,
        spent,
        remaining: budget.limit - spent,
        percentageUsed: budget.limit > 0 ? (spent / budget.limit) * 100 : 0
      };
    });
    
    res.json(budgetsWithSpent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets" });
  }
});

// Create new budget
router.post("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const { category, limit, period = "monthly" } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ message: "Category and limit are required" });
    }

    const budget: Budget = {
      id: Date.now().toString(),
      userId,
      category,
      limit: parseFloat(limit),
      spent: 0,
      period,
      createdAt: new Date().toISOString()
    };

    saveBudget(budget);
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Error creating budget" });
  }
});

// Update budget
router.put("/:id", (req: AuthenticatedRequest, res) => {
  try {
    const budgetId = req.params.id;
    const { category, limit, period } = req.body;
    
    const updates = {
      ...(category && { category }),
      ...(limit && { limit: parseFloat(limit) }),
      ...(period && { period })
    };

    updateBudget(budgetId, updates);
    res.json({ message: "Budget updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating budget" });
  }
});

// Delete budget
router.delete("/:id", (req: AuthenticatedRequest, res) => {
  try {
    const budgetId = req.params.id;
    deleteBudget(budgetId);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget" });
  }
});

// Budget simulator endpoint
router.post("/simulate", (req: AuthenticatedRequest, res) => {
  try {
    const { income, expenses, savingsGoal, timeframe } = req.body;
    
    if (!income || !expenses || !savingsGoal || !timeframe) {
      return res.status(400).json({ message: "All simulation parameters are required" });
    }

    const monthlyIncome = parseFloat(income);
    const monthlyExpenses = Object.values(expenses).reduce((sum: number, amount: any) => sum + parseFloat(amount), 0);
    const monthlySavingsGoal = parseFloat(savingsGoal);
    const months = parseInt(timeframe);

    // Calculate simulation results
    const monthlyRemaining = monthlyIncome - monthlyExpenses;
    const canReachGoal = monthlyRemaining >= monthlySavingsGoal;
    const actualMonthlySavings = Math.max(0, monthlyRemaining);
    const totalSaved = actualMonthlySavings * months;
    const goalAmount = monthlySavingsGoal * months;
    
    // Generate recommendations
    const recommendations = generateBudgetRecommendations(monthlyIncome, expenses, monthlySavingsGoal);

    res.json({
      simulation: {
        monthlyIncome,
        monthlyExpenses,
        monthlyRemaining,
        monthlySavingsGoal,
        canReachGoal,
        actualMonthlySavings,
        totalSaved,
        goalAmount,
        shortfall: goalAmount - totalSaved,
        months
      },
      recommendations,
      categoryBreakdown: expenses
    });
  } catch (error) {
    res.status(500).json({ message: "Error running budget simulation" });
  }
});

function generateBudgetRecommendations(income: number, expenses: any, savingsGoal: number): string[] {
  const recommendations = [];
  const totalExpenses = Object.values(expenses).reduce((sum: number, amount: any) => sum + parseFloat(amount), 0);
  const remaining = income - totalExpenses;

  if (remaining < savingsGoal) {
    recommendations.push("Your current expenses exceed your savings goal. Consider reducing spending.");
    
    // Check high expense categories
    if (expenses.housing && parseFloat(expenses.housing) > income * 0.3) {
      recommendations.push("Housing costs are above 30% of income. Consider downsizing or finding roommates.");
    }
    
    if (expenses.entertainment && parseFloat(expenses.entertainment) > income * 0.1) {
      recommendations.push("Entertainment spending is high. Try free activities or set a stricter limit.");
    }
    
    if (expenses.food && parseFloat(expenses.food) > income * 0.15) {
      recommendations.push("Food costs are above 15% of income. Consider meal planning and cooking at home more.");
    }
  } else {
    recommendations.push("Great! You're on track to meet your savings goal.");
    
    if (remaining > savingsGoal * 1.5) {
      recommendations.push("You have room to increase your savings goal or invest the extra money.");
    }
  }

  return recommendations;
}

export { router as budgetRoutes };