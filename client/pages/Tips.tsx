import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  DollarSign, 
  Target, 
  PiggyBank, 
  TrendingUp,
  CreditCard,
  Shield,
  Calculator
} from "lucide-react";

export default function TipsPage() {
  const tipCategories = [
    {
      title: "Budgeting Basics",
      icon: Calculator,
      color: "bg-blue-50 text-blue-700",
      tips: [
        "Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
        "Track every expense for at least one month to understand your spending patterns",
        "Set up automatic transfers to your savings account on payday",
        "Review and adjust your budget monthly based on actual spending",
        "Use cash or debit cards to avoid overspending on credit"
      ]
    },
    {
      title: "Smart Saving",
      icon: PiggyBank,
      color: "bg-green-50 text-green-700",
      tips: [
        "Start with a $1,000 emergency fund before paying off debt",
        "Build up to 3-6 months of expenses in your emergency fund",
        "Automate your savings - pay yourself first",
        "Use high-yield savings accounts for emergency funds",
        "Save loose change and small windfalls (tax refunds, bonuses)"
      ]
    },
    {
      title: "Debt Management", 
      icon: CreditCard,
      color: "bg-red-50 text-red-700",
      tips: [
        "Pay more than the minimum payment on all debts",
        "Use debt avalanche method: pay off highest interest debt first",
        "Consider debt snowball for motivation: pay off smallest balances first",
        "Avoid taking on new debt while paying off existing debt",
        "Negotiate with creditors if you're struggling to make payments"
      ]
    },
    {
      title: "Investment Principles",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-700",
      tips: [
        "Start investing early to benefit from compound interest",
        "Diversify your investments across different asset classes",
        "Don't try to time the market - invest consistently",
        "Keep investment fees low with index funds",
        "Only invest money you won't need for at least 5 years"
      ]
    },
    {
      title: "Financial Security",
      icon: Shield,
      color: "bg-yellow-50 text-yellow-700",
      tips: [
        "Get adequate health insurance to avoid medical debt",
        "Consider term life insurance if you have dependents",
        "Keep important financial documents in a safe place",
        "Monitor your credit report annually for errors",
        "Have a financial power of attorney and will prepared"
      ]
    },
    {
      title: "Money Psychology",
      icon: Lightbulb,
      color: "bg-indigo-50 text-indigo-700",
      tips: [
        "Understand your money mindset and emotional triggers",
        "Wait 24 hours before making large purchases",
        "Focus on experiences over material possessions",
        "Avoid lifestyle inflation when your income increases",
        "Celebrate small financial wins to stay motivated"
      ]
    }
  ];

  return (
    <section className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Daily Financial Tips</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Practical advice to help you build better financial habits and achieve your money goals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tipCategories.map((category, index) => (
            <Card key={index} className="rounded-xl hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
          <div className="text-center">
            <DollarSign className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">💡 Daily Tip</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              "The best time to start managing your finances was yesterday. The second best time is today. 
              Start small, be consistent, and watch your financial health improve over time."
            </p>
            <div className="mt-4">
              <Badge variant="secondary">Remember: Progress over perfection</Badge>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto text-blue-600 mb-3" />
              <h4 className="font-semibold text-blue-900 mb-2">Set Clear Goals</h4>
              <p className="text-sm text-blue-800">
                Define specific, measurable financial goals with deadlines to stay motivated.
              </p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <PiggyBank className="h-8 w-8 mx-auto text-green-600 mb-3" />
              <h4 className="font-semibold text-green-900 mb-2">Start Small</h4>
              <p className="text-sm text-green-800">
                Even saving $25 per month builds the habit and compounds over time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl bg-purple-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-purple-600 mb-3" />
              <h4 className="font-semibold text-purple-900 mb-2">Stay Consistent</h4>
              <p className="text-sm text-purple-800">
                Regular small actions beat occasional large efforts in building wealth.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}