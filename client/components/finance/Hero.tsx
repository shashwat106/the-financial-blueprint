import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-emerald-50 to-transparent" />
      <div className="container py-16 md:py-24 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border bg-white/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            Personal Finance, reimagined
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Take Control of Your Money with Smart AI Tools
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Plan budgets, track expenses, set savings goals, explore stocks, and get AI-powered insights—all in a clean, modern dashboard.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link to="/budget">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tips" className="text-sm text-muted-foreground hover:text-foreground">See daily tips</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
