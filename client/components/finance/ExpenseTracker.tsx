import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";

export interface Expense { category: string; amount: number }

const COLORS = [
  "#27ae60",
  "#2ecc71",
  "#16a085",
  "#1abc9c",
  "#2d3436",
  "#636e72",
];

export function ExpenseTracker({
  expenses,
  addExpense,
}: {
  expenses: Expense[];
  addExpense: (e: Expense) => void;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const category = String(form.get("category") || "").trim();
    const amount = parseFloat(String(form.get("amount") || "0"));
    if (!category || !Number.isFinite(amount) || amount <= 0) return;
    addExpense({ category, amount });
    e.currentTarget.reset();
  };
  const byCategory = Object.values(
    expenses.reduce((acc, cur) => {
      acc[cur.category] = acc[cur.category] || { name: cur.category, value: 0 };
      acc[cur.category].value += cur.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>),
  );

  return (
    <Card id="expenses" className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Category</Label>
            <Input name="category" placeholder="e.g. Groceries" required />
          </div>
          <div>
            <Label className="text-xs">Amount</Label>
            <Input name="amount" type="number" min={0} step="0.01" required />
          </div>
          <div className="col-span-3">
            <Button type="submit" className="w-full">Add Expense</Button>
          </div>
        </form>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke="#fff" strokeWidth={2}>
                {byCategory.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
