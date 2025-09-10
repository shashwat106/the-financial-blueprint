import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthContext";
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  Calendar,
  PieChart,
  BarChart3,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Activity
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
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

interface Insight {
  id: string;
  type: "positive" | "warning" | "neutral" | "achievement";
  title: string;
  description: string;
  value?: string;
  change?: number;
  icon: any;
  action?: string;
}

interface SpendingInsight {
  category: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  change: number;
}

const insightIcons = {
  positive: CheckCircle,
  warning: AlertTriangle,
  neutral: Activity,
  achievement: Target
};

const insightColors = {
  positive: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  neutral: "bg-blue-50 text-blue-700 border-blue-200",
  achievement: "bg-purple-50 text-purple-700 border-purple-200"
};

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", 
  "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"
];

export function InsightsEngine() {
  const { user, token } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingInsight[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      generateInsights();
    }
  }, [user, token]);

  const generateInsights = async () => {
    try {
      // Fetch expense summary for insights
      const response = await fetch('/api/expenses/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        analyzeAndGenerateInsights(data);
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
    setLoading(false);
  };

  const analyzeAndGenerateInsights = (data: any) => {
    const generatedInsights: Insight[] = [];
    const spendingBreakdown: SpendingInsight[] = [];
    
    // Process spending data
    if (data.comparison && data.comparison.length > 0) {
      let totalSpent = 0;
      data.comparison.forEach((item: any) => {
        totalSpent += item.user;
        spendingBreakdown.push({
          category: item.category,
          amount: item.user,
          percentage: 0, // Will calculate after
          trend: item.user > item.average ? "up" : "down",
          change: ((item.user - item.average) / item.average) * 100
        });
      });

      // Calculate percentages
      spendingBreakdown.forEach(item => {
        item.percentage = (item.amount / totalSpent) * 100;
      });

      // Sort by amount spent
      spendingBreakdown.sort((a, b) => b.amount - a.amount);
      setSpendingData(spendingBreakdown);

      // Generate insights based on spending data
      if (spendingBreakdown.length > 0) {
        const topCategory = spendingBreakdown[0];
        generatedInsights.push({
          id: "top-spending",
          type: "neutral",
          title: `Top Spending Category: ${topCategory.category}`,
          description: `You spent $${topCategory.amount.toLocaleString()} on ${topCategory.category} this month (${topCategory.percentage.toFixed(1)}% of total spending).`,
          value: `$${topCategory.amount.toLocaleString()}`,
          icon: PieChart
        });

        // Check for savings rate
        const estimatedIncome = totalSpent * 1.5; // Rough estimate
        const savingsRate = ((estimatedIncome - totalSpent) / estimatedIncome) * 100;
        
        if (savingsRate >= 20) {
          generatedInsights.push({
            id: "savings-rate",
            type: "positive",
            title: "Excellent Savings Rate! 🔥",
            description: `You're saving approximately ${savingsRate.toFixed(1)}% of your income. You're on track for your financial goals!`,
            value: `${savingsRate.toFixed(1)}%`,
            change: 15,
            icon: TrendingUp,
            action: "Keep up the great work!"
          });
        } else if (savingsRate >= 10) {
          generatedInsights.push({
            id: "savings-rate",
            type: "neutral",
            title: "Good Savings Progress",
            description: `You're saving about ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% for optimal financial health.`,
            value: `${savingsRate.toFixed(1)}%`,
            icon: Target,
            action: "Try to save a bit more each month"
          });
        } else {
          generatedInsights.push({
            id: "savings-rate",
            type: "warning",
            title: "Savings Opportunity",
            description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Consider reviewing your expenses to increase savings.`,
            value: `${savingsRate.toFixed(1)}%`,
            icon: AlertTriangle,
            action: "Review and optimize your spending"
          });
        }

        // Compare spending to average
        const aboveAverageCategories = spendingBreakdown.filter(item => item.trend === "up");
        if (aboveAverageCategories.length > 0) {
          const topOverspend = aboveAverageCategories[0];
          generatedInsights.push({
            id: "spending-comparison",
            type: "warning",
            title: `Above Average: ${topOverspend.category}`,
            description: `You spent ${Math.abs(topOverspend.change).toFixed(1)}% more than average on ${topOverspend.category}. Consider setting a budget limit.`,
            value: `+${Math.abs(topOverspend.change).toFixed(1)}%`,
            icon: ArrowUp,
            action: "Set a budget for this category"
          });
        }

        // Check for balanced spending
        const belowAverageCategories = spendingBreakdown.filter(item => item.trend === "down");
        if (belowAverageCategories.length > 0) {
          const topSaver = belowAverageCategories[0];
          generatedInsights.push({
            id: "spending-wins",
            type: "positive",
            title: `Smart Spending: ${topSaver.category}`,
            description: `You spent ${Math.abs(topSaver.change).toFixed(1)}% less than average on ${topSaver.category}. Great job staying under budget!`,
            value: `-${Math.abs(topSaver.change).toFixed(1)}%`,
            change: Math.abs(topSaver.change),
            icon: ArrowDown,
            action: "Apply this discipline to other categories"
          });
        }
      }

      // Generate monthly trends data (mock data for demo)
      const trends = [
        { month: "Jan", income: 4800, expenses: 3200, savings: 1600 },
        { month: "Feb", income: 5000, expenses: 3400, savings: 1600 },
        { month: "Mar", income: 5200, expenses: 3600, savings: 1600 },
        { month: "Apr", income: 5000, expenses: totalSpent, savings: 5000 - totalSpent },
      ];
      setMonthlyTrends(trends);
    }

    setInsights(generatedInsights.slice(0, 4)); // Limit to 4 insights
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Analyzing your spending patterns...</p>
            ) : insights.length === 0 ? (
              <div className="text-center py-4">
                <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Add expenses to see personalized insights</p>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight) => {
                  const IconComponent = insightIcons[insight.type];
                  return (
                    <div 
                      key={insight.id} 
                      className={`p-3 rounded-lg border ${insightColors[insight.type]}`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            {insight.value && (
                              <Badge variant="outline" className="text-xs">
                                {insight.value}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {insight.description}
                          </p>
                          {insight.action && (
                            <p className="text-xs font-medium mt-1 opacity-80">
                              💡 {insight.action}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {spendingData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={spendingData.map((item, index) => ({
                        name: item.category,
                        value: item.amount,
                        percentage: item.percentage
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spendingData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No spending data yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Financial Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      {spendingData.length > 0 && (
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Category Performance vs Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'vs Average']} />
                  <Bar 
                    dataKey="change" 
                    radius={[4, 4, 0, 0]}
                    fill="#8884d8"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.trend === "up" ? "#ef4444" : "#10b981"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}