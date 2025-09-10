import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface BudgetItem { name: string; amount: number }
export function BudgetPlanner({
  income,
  setIncome,
  budget,
  setBudget,
}: {
  income: number;
  setIncome: (v: number) => void;
  budget: BudgetItem[];
  setBudget: (v: BudgetItem[]) => void;
}) {
  const updateAmount = (idx: number, val: number) => {
    const next = [...budget];
    next[idx] = { ...next[idx], amount: val };
    setBudget(next);
  };
  const total = budget.reduce((s, b) => s + (Number.isFinite(b.amount) ? b.amount : 0), 0);
  return (
    <Card id="budget" className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Budget Planner</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-sm">Monthly Income</Label>
            <Input
              type="number"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="mt-1"
              min={0}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {budget.map((b, i) => (
              <div key={b.name} className="grid gap-1.5">
                <Label className="text-xs text-muted-foreground">{b.name}</Label>
                <Input
                  type="number"
                  value={b.amount}
                  onChange={(e) => updateAmount(i, parseFloat(e.target.value) || 0)}
                  min={0}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Allocated: ${total.toLocaleString()} of ${income.toLocaleString()} ({income ? Math.min(100, Math.round((total / income) * 100)) : 0}%)</p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budget}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "hsl(var(--accent))" }} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
