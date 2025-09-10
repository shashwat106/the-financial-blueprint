import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Plus, Trash2, Calculator, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function BudgetPage() {
  const { user, token } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Budget Simulator State
  const [simulatorData, setSimulatorData] = useState({
    income: 5000,
    expenses: {
      housing: 1500,
      food: 600,
      transportation: 300,
      entertainment: 250,
      utilities: 200,
      healthcare: 150,
      other: 200
    },
    savingsGoal: 500,
    timeframe: 12
  });
  
  const [simulationResult, setSimulationResult] = useState(null);
  
  // New Budget Form State
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  });

  useEffect(() => {
    if (user && token) {
      fetchBudgets();
    } else {
      setLoading(false);
    }
  }, [user, token]);
  
  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    }
    setLoading(false);
  };
  
  const createBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.limit) return;
    
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBudget)
      });
      
      if (response.ok) {
        setNewBudget({ category: '', limit: '', period: 'monthly' });
        fetchBudgets();
      }
    } catch (error) {
      console.error('Failed to create budget:', error);
    }
  };
  
  const runSimulation = async () => {
    try {
      const response = await fetch('/api/budgets/simulate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(simulatorData)
      });
      
      if (response.ok) {
        const result = await response.json();
        setSimulationResult(result);
      }
    } catch (error) {
      console.error('Failed to run simulation:', error);
    }
  };
  
  if (!user) {
    return (
      <section className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Budget Planning</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to create budgets, track your spending, and use our budget simulator.
          </p>
          <Button onClick={() => setLoginOpen(true)}>
            Sign In to Get Started
          </Button>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </section>
    );
  }
  
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Budget Planning</h1>
      
      <Tabs defaultValue="budgets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="budgets">My Budgets</TabsTrigger>
          <TabsTrigger value="simulator">Budget Simulator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="budgets" className="space-y-6">
          {/* Create New Budget */}
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Budget</h2>
              <form onSubmit={createBudget} className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g. Food, Entertainment"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="limit">Monthly Limit ($)</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                    placeholder="500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="period">Period</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newBudget.period}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value }))}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Budget List */}
          {loading ? (
            <p>Loading budgets...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {budgets.map((budget) => {
                const percentageUsed = Math.min((budget.spent / budget.limit) * 100, 100);
                const isOverBudget = budget.spent > budget.limit;
                
                return (
                  <Card key={budget.id} className="rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{budget.category}</h3>
                        <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                          {budget.period}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Spent</span>
                          <span className={isOverBudget ? "text-red-600 font-medium" : ""}>
                            ${budget.spent.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget</span>
                          <span>${budget.limit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-muted-foreground">Remaining</span>
                          <span className={budget.remaining >= 0 ? "text-green-600" : "text-red-600"}>
                            ${Math.abs(budget.remaining).toLocaleString()}
                            {budget.remaining < 0 && " over"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Usage</span>
                          <span className="text-xs font-medium">{percentageUsed.toFixed(0)}%</span>
                        </div>
                        <Progress 
                          value={percentageUsed} 
                          className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`}
                        />
                      </div>
                      
                      {isOverBudget && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Over budget by ${(budget.spent - budget.limit).toLocaleString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              
              {budgets.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <p>No budgets created yet. Add your first budget above!</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="simulator" className="space-y-6">
          <Card className="rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Budget Simulator</h2>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sim-income">Monthly Income ($)</Label>
                    <Input
                      id="sim-income"
                      type="number"
                      value={simulatorData.income}
                      onChange={(e) => setSimulatorData(prev => ({ ...prev, income: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <div>
                    <Label>Monthly Expenses</Label>
                    <div className="grid gap-3 mt-2">
                      {Object.entries(simulatorData.expenses).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <Label className="w-24 capitalize text-sm">{key}:</Label>
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => setSimulatorData(prev => ({
                              ...prev,
                              expenses: {
                                ...prev.expenses,
                                [key]: parseFloat(e.target.value) || 0
                              }
                            }))}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="savings-goal">Monthly Savings Goal ($)</Label>
                      <Input
                        id="savings-goal"
                        type="number"
                        value={simulatorData.savingsGoal}
                        onChange={(e) => setSimulatorData(prev => ({ ...prev, savingsGoal: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeframe">Timeframe (months)</Label>
                      <Input
                        id="timeframe"
                        type="number"
                        value={simulatorData.timeframe}
                        onChange={(e) => setSimulatorData(prev => ({ ...prev, timeframe: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={runSimulation} className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                  
                  {/* Budget Tips Section */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      💡 Smart Budgeting Tips
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium mb-1">50/30/20 Rule</h4>
                        <p className="text-muted-foreground">Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium mb-1">Emergency Fund Priority</h4>
                        <p className="text-muted-foreground">Build $1,000 emergency fund first, then work toward 3-6 months of expenses.</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium mb-1">Track Everything</h4>
                        <p className="text-muted-foreground">Small purchases add up quickly. Track every expense to understand your spending patterns.</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <h4 className="font-medium mb-1">Automate Savings</h4>
                        <p className="text-muted-foreground">Set up automatic transfers to savings accounts to pay yourself first.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {simulationResult && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Simulation Results</h3>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-800 space-y-1">
                          <p><strong>Monthly Income:</strong> ${simulationResult.simulation.monthlyIncome.toLocaleString()}</p>
                          <p><strong>Monthly Expenses:</strong> ${simulationResult.simulation.monthlyExpenses.toLocaleString()}</p>
                          <p><strong>Monthly Remaining:</strong> 
                            <span className={simulationResult.simulation.monthlyRemaining >= 0 ? "text-green-600" : "text-red-600"}>
                              ${simulationResult.simulation.monthlyRemaining.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${
                        simulationResult.simulation.canReachGoal ? "bg-green-50" : "bg-red-50"
                      }`}>
                        <p className={`font-medium ${
                          simulationResult.simulation.canReachGoal ? "text-green-800" : "text-red-800"
                        }`}>
                          {simulationResult.simulation.canReachGoal 
                            ? `✓ You can reach your savings goal!` 
                            : `✗ You cannot reach your current savings goal.`}
                        </p>
                        <p className={`text-sm mt-1 ${
                          simulationResult.simulation.canReachGoal ? "text-green-700" : "text-red-700"
                        }`}>
                          Goal: ${simulationResult.simulation.goalAmount.toLocaleString()} | 
                          Projected: ${simulationResult.simulation.totalSaved.toLocaleString()}
                          {!simulationResult.simulation.canReachGoal && 
                            ` (${simulationResult.simulation.shortfall.toLocaleString()} short)`}
                        </p>
                      </div>
                      
                      {simulationResult.recommendations.length > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-800 mb-2">Recommendations:</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {simulationResult.recommendations.map((rec, i) => (
                              <li key={i}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
