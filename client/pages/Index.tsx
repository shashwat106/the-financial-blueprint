import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Hero } from "@/components/finance/Hero";
import { 
  PiggyBank, 
  ChartPie, 
  Target, 
  TrendingUp, 
  Star,
  DollarSign,
  ShoppingCart,
  Wallet,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye,
  Calendar,
  Award
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { useEffect, useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AchievementSystem } from "@/components/finance/AchievementSystem";
import { InsightsEngine } from "@/components/finance/InsightsEngine";
import { ExportReports } from "@/components/finance/ExportReports";
import { QuickActions } from "@/components/finance/QuickActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  CartesianGrid,
} from "recharts";

const featureItems = [
  {
    icon: PiggyBank,
    title: "Smart Budgeting",
    text: "Track spending with AI.",
  },
  {
    icon: ChartPie,
    title: "Expense Tracking",
    text: "See where your money goes.",
  },
  {
    icon: Target,
    title: "Savings Goals",
    text: "Set & reach milestones.",
  },
  {
    icon: TrendingUp,
    title: "Stock Insights",
    text: "Follow markets easily.",
  },
];

// Demo data for marketing homepage only
const demoBarData = [
  { name: "Rent", value: 1500 },
  { name: "Food", value: 600 },
  { name: "Trans", value: 250 },
  { name: "Util", value: 200 },
];
const demoPieData = [
  { name: "Needs", value: 65, color: "#27ae60" },
  { name: "Wants", value: 25, color: "#a7f3d0" },
  { name: "Savings", value: 10, color: "#16a34a" },
];
const demoRadialData = [{ name: "Progress", value: 72, fill: "#27ae60" }];

export default function Index() {
  const { user, token } = useAuth();
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    monthlyGoalProgress: 0,
    achievements: []
  });
  const [loginOpen, setLoginOpen] = useState(false);
  
  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);
  
  const fetchDashboardData = async () => {
    try {
      // Fetch all dashboard data in parallel
      const [expenseRes, budgetRes] = await Promise.all([
        fetch('/api/expenses/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/budgets', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (expenseRes.ok) {
        const expenseData = await expenseRes.json();
        setExpenseSummary(expenseData);
        
        // Calculate dashboard metrics
        const totalExpenses = expenseData.totalSpent || 0;
        const estimatedIncome = totalExpenses > 0 ? Math.round(totalExpenses * 1.5) : 5000;
        const savings = Math.max(0, estimatedIncome - totalExpenses);
        
        setDashboardData(prev => ({
          ...prev,
          totalIncome: estimatedIncome,
          totalExpenses: totalExpenses,
          totalSavings: savings,
          monthlyGoalProgress: totalExpenses > 0 ? Math.min(100, Math.round((savings / (estimatedIncome * 0.2)) * 100)) : 65
        }));
      }
      
      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();
        setBudgets(budgetData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };
  
  // Show dashboard for logged-in users, marketing page for others
  if (user) {
    return (
      <div className="container py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}! 👋</h1>
            <p className="text-muted-foreground mt-1">Here's your financial overview for this month</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              On Track
            </Badge>
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Income Card */}
          <Card className="rounded-xl shadow-sm border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center">
                💰
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${dashboardData.totalIncome.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="rounded-xl shadow-sm border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
              <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 grid place-items-center">
                🛒
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${dashboardData.totalExpenses.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowDown className="h-3 w-3 mr-1 text-green-500" />
                -5% from last month
              </div>
              <Progress 
                value={(dashboardData.totalExpenses / dashboardData.totalIncome) * 100} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>

          {/* Savings Card */}
          <Card className="rounded-xl shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 grid place-items-center">
                💸
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${dashboardData.totalSavings.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                +18% from last month
              </div>
              <Progress 
                value={dashboardData.monthlyGoalProgress} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>

          {/* Goals Card */}
          <Card className="rounded-xl shadow-sm border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Goal</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 grid place-items-center">
                🎯
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {dashboardData.monthlyGoalProgress}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Save ${Math.round(dashboardData.totalIncome * 0.2).toLocaleString()} this month
              </div>
              <Progress 
                value={dashboardData.monthlyGoalProgress} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Add Expense</h3>
                  <p className="text-sm text-muted-foreground">Track your spending</p>
                </div>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Create Budget</h3>
                  <p className="text-sm text-muted-foreground">Set spending limits</p>
                </div>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">View Reports</h3>
                  <p className="text-sm text-muted-foreground">Download insights</p>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement System */}
        <AchievementSystem />

        {/* Insights & Analytics */}
        <InsightsEngine />

        {/* Quick Actions */}
        <QuickActions />

        {/* Export Reports */}
        <ExportReports />

        {/* Charts and Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Expense Breakdown */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseSummary?.comparison || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {(expenseSummary?.comparison || []).map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color || `hsl(${(i * 60) % 360}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Spending Trends */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseSummary?.categoryTotals || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Marketing homepage for non-logged-in users
  return (
    <div className="space-y-20">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Features */}
      <section className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Powerful features</h2>
          <p className="text-muted-foreground mt-2">
            Everything you need to plan, track and grow your finances.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureItems.map((f, i) => (
            <Card key={i} className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Dashboard preview */}
      <section className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">
            Your Finances, All in One Place
          </h2>
          <p className="text-muted-foreground mt-2">
            From budgets to stocks—everything in a clean, modern dashboard.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Monthly Expenses</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demoBarData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#27ae60" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Budget Allocation</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={demoPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {demoPieData.map((p, i) => (
                      <Cell key={i} fill={p.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Savings Goal</h3>
              <div className="flex items-center justify-center h-[200px]">
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={demoRadialData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 grid place-items-center text-lg font-semibold">
                    72%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Expense Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">How You Compare</h2>
            <p className="text-muted-foreground mt-2">
              See how your spending compares to the average person in your area.
            </p>
          </div>
          <div className="mt-10 max-w-4xl mx-auto">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                {user && expenseSummary ? (
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Spending Breakdown Pie Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Your Spending Breakdown</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenseSummary.comparison.map((item, i) => ({
                                name: item.category,
                                value: item.user,
                                fill: `hsl(${(i * 60) % 360}, 70%, 60%)`
                              }))}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Comparison Bar Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">You vs Average Spending</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={expenseSummary.comparison.map(item => ({
                              category: item.category.length > 8 ? item.category.substring(0, 8) + '...' : item.category,
                              you: item.user,
                              average: item.average,
                              difference: item.user - item.average
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                            <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'you' ? 'Your Spending' : 'Average Spending']} />
                            <Bar dataKey="you" fill="#3b82f6" name="you" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="average" fill="#6b7280" name="average" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="lg:col-span-2 grid gap-4 md:grid-cols-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900">Total Monthly Spending</h4>
                        <p className="text-2xl font-bold text-blue-800 mt-1">
                          ${expenseSummary.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          {expenseSummary.expenseCount} recorded expenses
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900">Best Category</h4>
                        <p className="text-lg font-bold text-green-800 mt-1">
                          {expenseSummary.comparison.find(item => item.user <= item.average)?.category || 'None yet'}
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Below average spending ✓
                        </p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-900">Watch Category</h4>
                        <p className="text-lg font-bold text-orange-800 mt-1">
                          {expenseSummary.comparison.find(item => item.user > item.average)?.category || 'All good!'}
                        </p>
                        <p className="text-sm text-orange-700 mt-1">
                          Above average spending ⚠
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Track Your Expenses to See Comparisons</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign in and start tracking your expenses to see how you compare to the average person.
                    </p>
                    {!user ? (
                      <Button onClick={() => setLoginOpen(true)}>
                        Sign Up to Get Started
                      </Button>
                    ) : (
                      <Button onClick={() => window.location.href = '/expenses'}>
                        Track Your First Expense
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="container">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">How It Works</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { title: "Sign Up", text: "Quick and easy onboarding." },
            {
              title: "Connect Accounts",
              text: "Import your expenses & income.",
            },
            { title: "Grow Smarter", text: "Get personalized AI insights." },
          ].map((s, i) => (
            <Card key={i} className="rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-bold">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* 6. Newsletter */}
      <section className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold">Get weekly AI money tips</h3>
          <p className="text-muted-foreground mt-2">
            Join thousands of users learning to save smarter.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Input
              type="email"
              placeholder="you@example.com"
              required
              className="h-11 max-w-xs"
            />
            <Button type="submit" className="h-11 px-6">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
