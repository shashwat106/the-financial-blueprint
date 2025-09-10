import express from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { 
  getUserExpenses, 
  saveExpense, 
  updateExpense, 
  deleteExpense,
  Expense 
} from "../utils/dataStore";

const router = express.Router();

// Get all expenses for user
router.get("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const expenses = getUserExpenses(userId);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Add new expense
router.post("/", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense: Expense = {
      id: Date.now().toString(),
      userId,
      amount: parseFloat(amount),
      category,
      description,
      date,
      createdAt: new Date().toISOString()
    };

    saveExpense(expense);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense" });
  }
});

// Update expense
router.put("/:id", (req: AuthenticatedRequest, res) => {
  try {
    const expenseId = req.params.id;
    const { amount, category, description, date } = req.body;
    
    const updates = {
      ...(amount && { amount: parseFloat(amount) }),
      ...(category && { category }),
      ...(description && { description }),
      ...(date && { date })
    };

    updateExpense(expenseId, updates);
    res.json({ message: "Expense updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating expense" });
  }
});

// Delete expense
router.delete("/:id", (req: AuthenticatedRequest, res) => {
  try {
    const expenseId = req.params.id;
    deleteExpense(expenseId);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense" });
  }
});

// Get expense summary and comparison
router.get("/summary", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const expenses = getUserExpenses(userId);
    
    // Calculate totals by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Average spending data for comparison
    const averageData = {
      Housing: 1800,
      Food: 750, 
      Transportation: 400,
      Entertainment: 350,
      Utilities: 220,
      Healthcare: 300,
      Shopping: 400,
      Other: 200
    };

    // Create comparison data
    const comparison = Object.keys(averageData).map(category => ({
      category,
      user: categoryTotals[category] || 0,
      average: averageData[category],
      color: getColorForCategory(category)
    }));

    res.json({
      categoryTotals,
      comparison,
      totalSpent: Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0),
      expenseCount: expenses.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expense summary" });
  }
});

function getColorForCategory(category: string): string {
  const colors = {
    Housing: "#27ae60",
    Food: "#3b82f6", 
    Transportation: "#f59e0b",
    Entertainment: "#8b5cf6",
    Utilities: "#ef4444",
    Healthcare: "#10b981",
    Shopping: "#f97316",
    Other: "#6b7280"
  };
  return colors[category] || "#6b7280";
}

export { router as expenseRoutes };