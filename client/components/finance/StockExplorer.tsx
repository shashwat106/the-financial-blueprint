import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SAMPLE_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 227.65, change: +1.34 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 424.11, change: -0.42 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 182.25, change: +0.88 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", price: 194.73, change: +0.21 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 238.41, change: -2.11 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 122.36, change: +3.25 },
];

export function StockExplorer() {
  const [q, setQ] = useState("");
  const results = SAMPLE_STOCKS.filter(
    (s) => s.symbol.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Card id="stocks" className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Stock Explorer</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Input placeholder="Search stocks (e.g. AAPL, Tesla)" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="divide-y rounded-lg border">
          {results.map((s) => (
            <div key={s.symbol} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{s.symbol}</div>
                <div className="text-xs text-muted-foreground">{s.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${s.price.toFixed(2)}</div>
                <div className={s.change >= 0 ? "text-emerald-600 text-xs" : "text-red-600 text-xs"}>
                  {s.change >= 0 ? "+" : ""}
                  {s.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">No results. Try another search.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
