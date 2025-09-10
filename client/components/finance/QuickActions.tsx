import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "sonner";
import { 
  Plus, 
  DollarSign, 
  Target, 
  Calendar,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Zap
} from "lucide-react";

const expenseCategories = [
  "Food & Dining",
  "Transportation", 
  "Housing",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Travel",
  "Education",
  "Other"
];

const budgetCategories = [
  "Monthly Rent",
  "Groceries",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Dining Out",
  "Healthcare",
  "Shopping",
  "Subscriptions",
  "Other"
];

interface QuickExpenseFormData {
  amount: string;
  category: string;
  description: string;
}

interface QuickBudgetFormData {
  category: string;
  amount: string;
  period: string;
}

interface QuickGoalFormData {
  name: string;
  targetAmount: string;
  targetDate: string;
  category: string;
}

export function QuickActions() {
  const { user, token } = useAuth();
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [budgetDialog, setBudgetDialog] = useState(false);
  const [goalDialog, setGoalDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [expenseForm, setExpenseForm] = useState<QuickExpenseFormData>({
    amount: "",
    category: "",
    description: ""
  });

  const [budgetForm, setBudgetForm] = useState<QuickBudgetFormData>({
    category: "",
    amount: "",
    period: "monthly"
  });

  const [goalForm, setGoalForm] = useState<QuickGoalFormData>({
    name: "",
    targetAmount: "",
    targetDate: "",
    category: "savings"
  });

  const resetForms = () => {
    setExpenseForm({ amount: "", category: "", description: "" });
    setBudgetForm({ category: "", amount: "", period: "monthly" });
    setGoalForm({ name: "", targetAmount: "", targetDate: "", category: "savings" });
  };

  const handleQuickExpense = async () => {
    if (!user || !token) {
      toast.error("Please log in to add expenses");
      return;
    }

    if (!expenseForm.amount || !expenseForm.category) {
      toast.error("Please fill in amount and category");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(expenseForm.amount),
          category: expenseForm.category,
          description: expenseForm.description || `${expenseForm.category} expense`,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        toast.success(`💰 Added $${expenseForm.amount} expense!`);
        setExpenseDialog(false);
        resetForms();
        // Trigger page refresh to update data
        window.location.reload();
      } else {
        throw new Error('Failed to add expense');
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBudget = async () => {
    if (!user || !token) {
      toast.error("Please log in to create budgets");
      return;
    }

    if (!budgetForm.category || !budgetForm.amount) {
      toast.error("Please fill in category and amount");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: budgetForm.category,
          amount: parseFloat(budgetForm.amount),
          period: budgetForm.period
        })
      });

      if (response.ok) {
        toast.success(`📊 Created $${budgetForm.amount} budget for ${budgetForm.category}!`);
        setBudgetDialog(false);
        resetForms();
        window.location.reload();
      } else {
        throw new Error('Failed to create budget');
      }
    } catch (error) {
      console.error('Failed to create budget:', error);
      toast.error("Failed to create budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGoal = async () => {
    if (!user || !token) {
      toast.error("Please log in to create goals");
      return;
    }

    if (!goalForm.name || !goalForm.targetAmount || !goalForm.targetDate) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/savings-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: goalForm.name,
          targetAmount: parseFloat(goalForm.targetAmount),
          currentAmount: 0,
          targetDate: goalForm.targetDate,
          category: goalForm.category
        })
      });

      if (response.ok) {
        toast.success(`🎯 Created goal: ${goalForm.name}!`);
        setGoalDialog(false);
        resetForms();
        window.location.reload();
      } else {
        throw new Error('Failed to create goal');
      }
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Quick Add Expense */}
          <Dialog open={expenseDialog} onOpenChange={setExpenseDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-red-50 hover:border-red-200">
                <DollarSign className="h-6 w-6 text-red-600" />
                <div className="text-center">
                  <div className="font-medium">Add Expense</div>
                  <div className="text-xs text-muted-foreground">Track spending</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-red-600" />
                  Quick Add Expense
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expense-amount">Amount *</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      placeholder="0.00"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expense-category">Category *</Label>
                    <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="expense-description">Description (optional)</Label>
                  <Input
                    id="expense-description"
                    placeholder="What did you buy?"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleQuickExpense} disabled={loading} className="flex-1">
                    {loading ? "Adding..." : "Add Expense"}
                  </Button>
                  <Button variant="outline" onClick={() => setExpenseDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Create Budget */}
          <Dialog open={budgetDialog} onOpenChange={setBudgetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200">
                <Wallet className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Set Budget</div>
                  <div className="text-xs text-muted-foreground">Control spending</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  Quick Set Budget
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget-category">Category *</Label>
                    <Select value={budgetForm.category} onValueChange={(value) => setBudgetForm({...budgetForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget-amount">Amount *</Label>
                    <Input
                      id="budget-amount"
                      type="number"
                      placeholder="0.00"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget-period">Period</Label>
                  <Select value={budgetForm.period} onValueChange={(value) => setBudgetForm({...budgetForm, period: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleQuickBudget} disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Set Budget"}
                  </Button>
                  <Button variant="outline" onClick={() => setBudgetDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Create Goal */}
          <Dialog open={goalDialog} onOpenChange={setGoalDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-200">
                <Target className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Create Goal</div>
                  <div className="text-xs text-muted-foreground">Save for future</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Quick Create Goal
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-name">Goal Name *</Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={goalForm.name}
                    onChange={(e) => setGoalForm({...goalForm, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-amount">Target Amount *</Label>
                    <Input
                      id="goal-amount"
                      type="number"
                      placeholder="0.00"
                      value={goalForm.targetAmount}
                      onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-date">Target Date *</Label>
                    <Input
                      id="goal-date"
                      type="date"
                      value={goalForm.targetDate}
                      onChange={(e) => setGoalForm({...goalForm, targetDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="goal-category">Category</Label>
                  <Select value={goalForm.category} onValueChange={(value) => setGoalForm({...goalForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">General Savings</SelectItem>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="home">Home & Property</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleQuickGoal} disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Goal"}
                  </Button>
                  <Button variant="outline" onClick={() => setGoalDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4 p-3 bg-accent/20 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Pro tip:</strong> Use these quick actions to instantly track expenses, set budgets, and create savings goals without navigating away from your dashboard!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}