import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthContext";
import { 
  Plus, 
  Target, 
  Calendar, 
  DollarSign, 
  Trash2, 
  Edit,
  TrendingUp,
  CheckCircle2,
  Clock
} from "lucide-react";
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

interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: "low" | "medium" | "high";
  progress?: number;
  remaining?: number;
  daysLeft?: number;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const goalCategories = [
  "Emergency Fund",
  "Vacation", 
  "Electronics",
  "Car/Vehicle",
  "Home/Property",
  "Education",
  "Investment",
  "Other"
];

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700", 
  high: "bg-red-100 text-red-700"
};

export function PersonalizedSavingsGoals() {
  const { user, token } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addMoneyDialog, setAddMoneyDialog] = useState<{open: boolean, goalId: string}>({open: false, goalId: ""});
  
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    category: "",
    priority: "medium" as const
  });

  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    if (user && token) {
      fetchGoals();
    }
  }, [user, token]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/savings-goals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Failed to fetch savings goals:', error);
    }
    setLoading(false);
  };

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline || !newGoal.category) return;
    
    try {
      const response = await fetch('/api/savings-goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newGoal,
          targetAmount: parseFloat(newGoal.targetAmount),
          currentAmount: parseFloat(newGoal.currentAmount)
        })
      });
      
      if (response.ok) {
        setNewGoal({
          name: "",
          description: "",
          targetAmount: "",
          currentAmount: "0",
          deadline: "",
          category: "",
          priority: "medium"
        });
        setDialogOpen(false);
        fetchGoals();
      }
    } catch (error) {
      console.error('Failed to create savings goal:', error);
    }
  };

  const addMoney = async (goalId: string, amount: string) => {
    try {
      const response = await fetch(`/api/savings-goals/${goalId}/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      
      if (response.ok) {
        setAddAmount("");
        setAddMoneyDialog({open: false, goalId: ""});
        fetchGoals();
      }
    } catch (error) {
      console.error('Failed to add money to goal:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/savings-goals/${goalId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  if (!user) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Create Personalized Savings Goals</h3>
          <p className="text-sm text-muted-foreground">
            Sign in to create custom savings goals with progress tracking
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Goal Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🎯 Savings Goals
          </h2>
          <p className="text-muted-foreground">Track your personalized financial milestones</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={createGoal} className="space-y-4">
              <div>
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Buy MacBook Pro"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="targetAmount">Target Amount ($)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="1500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentAmount">Current Amount ($)</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Create Goal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <p>Loading savings goals...</p>
      ) : goals.length === 0 ? (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Savings Goals Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first personalized savings goal to start tracking your financial milestones!
            </p>
            <Button onClick={() => setDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <Card key={goal.id} className={`rounded-xl shadow-sm transition-all hover:shadow-md ${goal.isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {goal.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Target className="h-5 w-5" />}
                      {goal.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={priorityColors[goal.priority]}>
                      {goal.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Bar and Stats */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(goal.progress || 0)}%</span>
                  </div>
                  <Progress 
                    value={goal.progress || 0} 
                    className={`h-2 ${goal.isCompleted ? '[&>div]:bg-green-500' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${goal.currentAmount.toLocaleString()} saved</span>
                    <span>${goal.targetAmount.toLocaleString()} goal</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-600">${(goal.remaining || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-600">{goal.daysLeft || 0} days</p>
                      <p className="text-xs text-muted-foreground">left</p>
                    </div>
                  </div>
                </div>

                {/* Category and Deadline */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>📁 {goal.category}</span>
                  <span>📅 {new Date(goal.deadline).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                {!goal.isCompleted && (
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => setAddMoneyDialog({open: true, goalId: goal.id})}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Money
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {goal.isCompleted && (
                  <div className="text-center py-2">
                    <Badge className="bg-green-100 text-green-800">
                      🎉 Goal Completed!
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Money Dialog */}
      <Dialog open={addMoneyDialog.open} onOpenChange={(open) => setAddMoneyDialog({open, goalId: ""})}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Money to Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount to Add ($)</Label>
              <Input
                id="amount"
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="100"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setAddMoneyDialog({open: false, goalId: ""})} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => addMoney(addMoneyDialog.goalId, addAmount)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!addAmount || parseFloat(addAmount) <= 0}
              >
                Add Money
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}