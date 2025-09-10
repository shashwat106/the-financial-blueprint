import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function SavingsGoals({
  goal,
  saved,
  setGoal,
  setSaved,
}: {
  goal: number;
  saved: number;
  setGoal: (v: number) => void;
  setSaved: (v: number) => void;
}) {
  const pct = goal > 0 ? Math.min(100, Math.round((saved / goal) * 100)) : 0;
  return (
    <Card id="savings" className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Goal Amount</Label>
            <Input type="number" value={goal} min={0} onChange={(e) => setGoal(parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <Label className="text-xs">Current Saved</Label>
            <Input type="number" value={saved} min={0} onChange={(e) => setSaved(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{pct}%</span>
          </div>
          <Progress value={pct} />
          <p className="text-xs text-muted-foreground mt-2">
            ${saved.toLocaleString()} of ${goal.toLocaleString()} saved
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
