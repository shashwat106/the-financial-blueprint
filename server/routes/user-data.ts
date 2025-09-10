import express from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { 
  getUserExpenses, 
  getUserBudgets,
  findUserById,
  User
} from "../utils/dataStore";

const router = express.Router();

// Get comprehensive user profile data
router.get("/profile", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const user = findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password, ...safeUser } = user;
    
    res.json({
      user: safeUser,
      joinDate: safeUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// Get user's financial summary for comparison
router.get("/financial-summary", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const expenses = getUserExpenses(userId);
    const budgets = getUserBudgets(userId);
    
    // Calculate monthly totals by category
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = {};
      
      acc[month][expense.category] = (acc[month][expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Get current month data
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthSpending = monthlyTotals[currentMonth] || {};
    
    // Calculate total spending by category (all time)
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Budget utilization
    const budgetUtilization = budgets.map(budget => {
      const spent = categoryTotals[budget.category] || 0;
      return {
        category: budget.category,
        budgeted: budget.limit,
        spent,
        remaining: budget.limit - spent,
        utilizationRate: budget.limit > 0 ? (spent / budget.limit) * 100 : 0
      };
    });

    // Spending patterns
    const spendingPatterns = {
      averageDailySpending: expenses.length > 0 ? 
        Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0) / 30 : 0,
      mostExpensiveCategory: Object.entries(categoryTotals).reduce(
        (max, [category, amount]) => amount > max.amount ? { category, amount } : max,
        { category: '', amount: 0 }
      ),
      spendingTrend: calculateSpendingTrend(monthlyTotals)
    };

    // User segmentation for comparison
    const userSegment = determineUserSegment(categoryTotals, budgets.length, expenses.length);

    res.json({
      userId,
      currentMonthSpending,
      categoryTotals,
      budgetUtilization,
      spendingPatterns,
      userSegment,
      dataCompleteness: {
        hasExpenses: expenses.length > 0,
        hasBudgets: budgets.length > 0,
        expenseCount: expenses.length,
        budgetCount: budgets.length,
        trackingDays: getTrackingDays(expenses)
      }
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({ message: "Error fetching financial summary" });
  }
});

// Store user comparison preferences
router.post("/comparison-preferences", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const { compareBy, region, ageGroup, incomeLevel } = req.body;
    
    // In a real app, this would be stored in the database
    // For now, we'll just acknowledge the preferences
    res.json({
      message: "Comparison preferences updated",
      preferences: {
        compareBy: compareBy || "national",
        region: region || "US",
        ageGroup: ageGroup || "25-34",
        incomeLevel: incomeLevel || "middle"
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating comparison preferences" });
  }
});

// Get personalized insights
router.get("/insights", (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const expenses = getUserExpenses(userId);
    const budgets = getUserBudgets(userId);
    
    const insights = generatePersonalizedInsights(expenses, budgets);
    
    res.json({
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating insights" });
  }
});

// Helper functions
function calculateSpendingTrend(monthlyTotals: Record<string, Record<string, number>>): string {
  const months = Object.keys(monthlyTotals).sort();
  if (months.length < 2) return "insufficient_data";
  
  const recentMonths = months.slice(-3);
  const totals = recentMonths.map(month => 
    Object.values(monthlyTotals[month]).reduce((sum, amount) => sum + amount, 0)
  );
  
  if (totals.length < 2) return "insufficient_data";
  
  const lastMonth = totals[totals.length - 1];
  const previousMonth = totals[totals.length - 2];
  
  if (lastMonth > previousMonth * 1.1) return "increasing";
  if (lastMonth < previousMonth * 0.9) return "decreasing";
  return "stable";
}

function determineUserSegment(categoryTotals: Record<string, number>, budgetCount: number, expenseCount: number): string {
  const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  if (expenseCount < 5) return "new_user";
  if (budgetCount === 0) return "expense_tracker";
  if (budgetCount > 0 && totalSpending > 3000) return "active_budgeter";
  if (budgetCount > 3 && expenseCount > 50) return "advanced_user";
  
  return "regular_user";
}

function getTrackingDays(expenses: any[]): number {
  if (expenses.length === 0) return 0;
  
  const dates = expenses.map(exp => new Date(exp.date).getTime());
  const earliest = Math.min(...dates);
  const latest = Math.max(...dates);
  
  return Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24));
}

function generatePersonalizedInsights(expenses: any[], budgets: any[]): any[] {
  const insights = [];
  
  // Spending insights
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const totalSpending = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  if (totalSpending > 0) {
    const topCategory = Object.entries(categoryTotals).reduce(
      (max, [category, amount]) => amount > max.amount ? { category, amount } : max,
      { category: '', amount: 0 }
    );
    
    insights.push({
      type: "spending_pattern",
      title: "Your Top Spending Category",
      description: `You spend most on ${topCategory.category} (${((topCategory.amount / totalSpending) * 100).toFixed(1)}% of total)`,
      actionable: true,
      suggestion: `Consider setting a specific budget for ${topCategory.category} to better control this expense.`
    });
  }
  
  // Budget insights
  if (budgets.length > 0) {
    const overBudgetCategories = budgets.filter(budget => {
      const spent = categoryTotals[budget.category] || 0;
      return spent > budget.limit;
    });
    
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: "budget_alert",
        title: "Budget Overrun Alert",
        description: `You're over budget in ${overBudgetCategories.length} categories`,
        actionable: true,
        suggestion: "Review these categories and consider adjusting spending or increasing the budget limits."
      });
    } else {
      insights.push({
        type: "budget_success",
        title: "Great Budget Management!",
        description: "You're staying within all your set budgets",
        actionable: false,
        suggestion: "Keep up the good work! Consider setting more detailed budgets for better tracking."
      });
    }
  }
  
  // Savings opportunity
  if (expenses.length > 10) {
    const avgDaily = totalSpending / 30;
    insights.push({
      type: "savings_opportunity",
      title: "Potential Monthly Savings",
      description: `If you reduce daily spending by $5, you could save $150/month`,
      actionable: true,
      suggestion: "Look for small cuts in discretionary spending like dining out or subscriptions."
    });
  }
  
  return insights;
}

export { router as userDataRoutes };