import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";

const TIPS = [
  "Pay yourself first: automate transfers to savings on payday.",
  "Track every expense for a week to reveal hidden leaks.",
  "Follow the 50/30/20 rule as a simple budgeting start.",
  "Negotiate recurring bills annually for better rates.",
  "Build a 3–6 month emergency fund before investing.",
  "Invest consistently; time in the market beats timing the market.",
  "Use cash-back credit cards but pay in full each month.",
  "Review subscriptions quarterly and cancel what you don’t use.",
];

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function FinancialTips() {
  const base = dayOfYear() % TIPS.length;
  const [i, setI] = useState(base);
  const tip = useMemo(() => TIPS[i % TIPS.length], [i]);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TIPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card id="tips" className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Financial Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 rounded-lg bg-accent">
          <p className="text-sm leading-relaxed">{tip}</p>
          <p className="text-xs text-muted-foreground mt-2">Rotating every 5 seconds</p>
        </div>
      </CardContent>
    </Card>
  );
}
