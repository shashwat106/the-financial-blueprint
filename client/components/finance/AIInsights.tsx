import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface InsightsMetrics {
  income: number;
  totalBudget: number;
  totalExpenses: number;
  savingsGoal: { goal: number; saved: number };
  topExpenseCategory?: string;
}

function genInsights(m: InsightsMetrics): string[] {
  const tips: string[] = [];
  if (m.income > 0) {
    const alloc = m.totalBudget / m.income;
    if (alloc > 1) tips.push("Your planned budget exceeds your income. Reduce categories by " + Math.round((alloc - 1) * 100) + "%.");
    else if (alloc > 0.9) tips.push("Tight budget: leave a buffer of at least 10% for surprises.");
    else tips.push("Great! You have " + Math.round((1 - alloc) * 100) + "% free to allocate or save.");
  }
  if (m.totalExpenses > m.totalBudget && m.totalBudget > 0) {
    tips.push("You are overspending vs. budget. Consider cutting discretionary costs.");
  }
  const { goal, saved } = m.savingsGoal;
  if (goal > 0) {
    const pct = Math.min(100, Math.round((saved / goal) * 100));
    tips.push(`Savings progress: ${pct}% of your goal.`);
    if (pct < 50) tips.push("Try automating an extra 5–10% of income into savings.");
  }
  if (m.topExpenseCategory) {
    tips.push(`Highest spend: ${m.topExpenseCategory}. Look for cheaper alternatives or set a cap.`);
  }
  if (tips.length === 0) tips.push("Add data to see personalized insights.");
  return tips.slice(0, 5);
}

export function AIInsights({ metrics }: { metrics: InsightsMetrics }) {
  const insights = genInsights(metrics);
  return (
    <Card className="rounded-xl shadow-sm border-primary/20">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          {insights.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3">Generated locally from your inputs.</p>
      </CardContent>
    </Card>
  );
}
