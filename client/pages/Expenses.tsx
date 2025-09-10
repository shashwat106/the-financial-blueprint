import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/auth/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Calendar,
  PieChart,
  BarChart3,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from "recharts";

export default function ExpensesPage() {
  const { user, token } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Expense Form
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // New Savings Goal Form  
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });
  
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlySpending, setMonthlySpending] = useState([]);
  
  const categories = [
    "Housing", "Food", "Transportation", "Entertainment", 
    "Utilities", "Healthcare", "Shopping", "Other"
  ];
  
  const colors = [
    "#27ae60", "#3b82f6", "#f59e0b", "#8b5cf6", 
    "#ef4444", "#10b981", "#f97316", "#6b7280"
  ];
  
  useEffect(() => {
    if (user && token) {
      fetchExpenses();
      fetchSavingsGoals();
    } else {
      setLoading(false);
    }
  }, [user, token]);
  
  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
        processExpenseData(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
    setLoading(false);
  };
  
  const fetchSavingsGoals = async () => {
    // This would be a real API call in production
    const mockGoals = [
      {
        id: 1,
        name: "Emergency Fund",
        targetAmount: 10000,
        currentAmount: 3500,
        deadline: "2024-12-31"
      },
      {
        id: 2,
        name: "Vacation Fund",
        targetAmount: 3000,
        currentAmount: 1200,
        deadline: "2024-06-30"
      }
    ];
    setSavingsGoals(mockGoals);
  };
  
  const processExpenseData = (expensesData) => {
    // Calculate category totals
    const totals = expensesData.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    setCategoryTotals(totals);
    
    // Calculate monthly spending for chart
    const monthlyData = expensesData.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ month, amount: expense.amount });
      }
      return acc;
    }, []);
    setMonthlySpending(monthlyData.slice(-6)); // Last 6 months
  };
  
  const addExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category || !newExpense.description) return;
    
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newExpense)
      });
      
      if (response.ok) {
        setNewExpense({ amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };
  
  const deleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };
  
  const addSavingsGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0
    };
    
    setSavingsGoals(prev => [...prev, goal]);
    setNewGoal({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
  };
  
  if (!user) {
    return (
      <section className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <Wallet className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Expenses & Savings</h1>
          <p className="text-muted-foreground mb-6">
            Track your expenses, set savings goals, and visualize your spending patterns.
          </p>
          <Button onClick={() => setLoginOpen(true)}>
            Sign Up to Start Tracking
          </Button>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </section>
    );
  }
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  const pieData = Object.entries(categoryTotals).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: colors[index % colors.length]
  }));
  
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Expenses & Savings Tracker</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="savings">Savings Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ArrowDownCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Savings Goals</p>
                    <p className="text-2xl font-bold">{savingsGoals.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <ArrowUpCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Saved</p>
                    <p className="text-2xl font-bold">
                      ${savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Spending by Category
                </h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No expenses recorded yet</p>
                    <p className="text-sm">Add your first expense to see the breakdown</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Spending Trend
                </h3>
                {monthlySpending.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlySpending}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Spent']} />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No spending data available</p>
                    <p className="text-sm">Track expenses for a few months to see trends</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Savings Goals Progress</h3>
              <div className="space-y-4">
                {savingsGoals.map(goal => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
                  
                  return (
                    <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{goal.name}</h4>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                          </p>
                        </div>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">{progress.toFixed(1)}% complete</span>
                        <Badge variant={progress >= 100 ? "default" : progress >= 50 ? "secondary" : "outline"}>
                          {progress >= 100 ? "Completed!" : progress >= 75 ? "Almost there" : "In progress"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {savingsGoals.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No savings goals set. Create your first goal in the Savings Goals tab!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Add New Expense</h3>
              <form onSubmit={addExpense} className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What was this for?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="md:col-span-4">
                  <Button type="submit" className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Expenses</h3>
              <div className="space-y-3">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {expenses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No expenses recorded yet</p>
                    <p className="text-sm">Add your first expense above to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Create New Savings Goal</h3>
              <form onSubmit={addSavingsGoal} className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Emergency Fund"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="target-amount">Target Amount ($)</Label>
                  <Input
                    id="target-amount"
                    type="number"
                    step="0.01"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="current-amount">Current Amount ($)</Label>
                  <Input
                    id="current-amount"
                    type="number"
                    step="0.01"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-4">
                  <Button type="submit" className="w-full md:w-auto">
                    <Target className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            {savingsGoals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
              
              return (
                <Card key={goal.id} className="rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-lg">{goal.name}</h4>
                      <Badge variant={progress >= 100 ? "default" : "secondary"}>
                        {progress.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      
                      <Progress value={Math.min(progress, 100)} className="h-3" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className={remaining <= 0 ? "text-green-600 font-medium" : ""}>
                          {remaining <= 0 ? "Goal Reached! 🎉" : `$${remaining.toLocaleString()}`}
                        </span>
                      </div>
                      
                      {goal.deadline && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time left</span>
                          <span className={daysLeft < 30 ? "text-orange-600" : ""}>
                            {daysLeft > 0 ? `${daysLeft} days` : "Overdue"}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button size="sm" variant="outline" className="w-full">
                        Update Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {savingsGoals.length === 0 && (
              <div className="md:col-span-2 text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No savings goals yet</p>
                <p className="text-sm">Create your first savings goal to start tracking progress!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Spending by Category</h3>
                {Object.keys(categoryTotals).length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={Object.entries(categoryTotals).map(([name, value], i) => ({
                            name,
                            value,
                            fill: `hsl(${(i * 45) % 360}, 70%, 60%)`
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {Object.entries(categoryTotals).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 45) % 360}, 70%, 60%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <RechartsPieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No expenses recorded yet</p>
                      <p className="text-sm">Add expenses to see spending breakdown</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Spending Trends</h3>
                {expenses.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(categoryTotals).map(([name, value]) => ({
                          category: name.length > 10 ? name.substring(0, 10) + '...' : name,
                          amount: value,
                          average: Math.random() * value * 0.8 + value * 0.6 // Simulated average for comparison
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'amount' ? 'Your Spending' : 'Suggested Budget']} />
                        <Bar dataKey="amount" fill="#3b82f6" name="amount" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="average" fill="#10b981" name="average" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No spending data yet</p>
                      <p className="text-sm">Add expenses to see trends</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}