import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Home,
  Search,
  BookOpen,
  Lightbulb,
  Target,
  AlertCircle,
  Info,
  Building,
  Briefcase,
  Shield
} from "lucide-react";

export default function FinancialResourcesPage() {
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const educationalTopics = {
    taxes: {
      title: "Understanding Taxes",
      icon: Calculator,
      description: "Learn how taxes work and how to optimize your tax strategy",
      content: [
        {
          title: "Tax Basics",
          points: [
            "Income tax is calculated on your earnings from work, investments, and other sources",
            "Tax brackets mean you pay different rates on different portions of your income",
            "Deductions reduce your taxable income, credits directly reduce taxes owed",
            "Standard deduction vs itemized deductions - choose what's better for you"
          ]
        },
        {
          title: "Common Tax Deductions",
          points: [
            "Mortgage interest on your primary residence",
            "State and local taxes (SALT) up to $10,000",
            "Charitable donations to qualified organizations",
            "Medical expenses exceeding 7.5% of your income",
            "Business expenses if you're self-employed"
          ]
        }
      ]
    },
    loans: {
      title: "Loans & Credit",
      icon: CreditCard,
      description: "Understand different types of loans and credit management",
      content: [
        {
          title: "Types of Loans",
          points: [
            "Personal loans: Unsecured, higher interest, flexible use",
            "Auto loans: Secured by vehicle, lower rates than personal loans",
            "Mortgages: Secured by property, lowest rates, long-term",
            "Student loans: Education financing, often government-backed"
          ]
        },
        {
          title: "Credit Score Factors",
          points: [
            "Payment history (35%): Always pay on time",
            "Credit utilization (30%): Keep below 30% of credit limits",
            "Length of credit history (15%): Keep old accounts open",
            "Credit mix (10%): Different types of credit accounts",
            "New credit (10%): Limit hard inquiries"
          ]
        }
      ]
    },
    inflation: {
      title: "Inflation & Economics",
      icon: TrendingUp,
      description: "How inflation affects your money and investment decisions",
      content: [
        {
          title: "Understanding Inflation",
          points: [
            "Inflation reduces purchasing power over time",
            "Average historical inflation rate is about 2-3% annually",
            "Cash loses value during inflation periods",
            "Real estate and stocks can hedge against inflation"
          ]
        },
        {
          title: "Protecting Against Inflation",
          points: [
            "Invest in assets that typically outpace inflation",
            "Consider Treasury Inflation-Protected Securities (TIPS)",
            "Diversify investments across asset classes",
            "Avoid holding large amounts of cash long-term"
          ]
        }
      ]
    },
    budgeting: {
      title: "Smart Budgeting",
      icon: Target,
      description: "Master the art of budgeting and expense management",
      content: [
        {
          title: "Budgeting Methods",
          points: [
            "50/30/20 Rule: 50% needs, 30% wants, 20% savings",
            "Zero-based budgeting: Every dollar has a purpose",
            "Pay yourself first: Save before spending",
            "Track expenses to understand spending patterns"
          ]
        },
        {
          title: "Emergency Fund Guidelines",
          points: [
            "Start with $1,000 as initial emergency fund",
            "Build up to 3-6 months of expenses",
            "Keep emergency fund in high-yield savings account",
            "Only use for true emergencies"
          ]
        }
      ]
    }
  };

  const policyTopics = {
    monetary: {
      title: "Monetary Policy",
      icon: Building,
      description: "Federal Reserve policies affecting interest rates and money supply",
      policies: [
        {
          name: "Federal Interest Rates",
          description: "The Fed sets baseline interest rates affecting all borrowing",
          impact: "Higher rates = more expensive loans, better savings rates",
          currentStatus: "Rates adjusted based on economic conditions"
        },
        {
          name: "Quantitative Easing",
          description: "Fed buying bonds to increase money supply during economic stress",
          impact: "Increases money supply, can lead to inflation",
          currentStatus: "Used during economic crises"
        }
      ]
    },
    fiscal: {
      title: "Fiscal Policy",
      icon: Briefcase,
      description: "Government spending and taxation policies",
      policies: [
        {
          name: "Tax Policy Changes",
          description: "Federal and state tax rate adjustments and deduction changes",
          impact: "Directly affects take-home pay and investment returns",
          currentStatus: "Tax laws change periodically through legislation"
        },
        {
          name: "Government Spending",
          description: "Infrastructure, healthcare, and social program funding",
          impact: "Affects economic growth and tax requirements",
          currentStatus: "Ongoing budget allocations and spending programs"
        }
      ]
    },
    financial: {
      title: "Financial Regulation",
      icon: Shield,
      description: "Banking and investment protection policies",
      policies: [
        {
          name: "FDIC Insurance",
          description: "Bank deposit insurance protecting consumer savings",
          impact: "Protects up to $250,000 per depositor per bank",
          currentStatus: "Active protection for bank deposits"
        },
        {
          name: "Consumer Financial Protection",
          description: "Regulations protecting consumers from predatory lending",
          impact: "Ensures fair lending practices and transparency",
          currentStatus: "Ongoing oversight and regulation updates"
        }
      ]
    }
  };

  const filteredEducationTopics = Object.entries(educationalTopics).filter(([key, topic]) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPolicyTopics = Object.entries(policyTopics).filter(([key, topic]) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl font-bold mb-4">Financial Resources & Education</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Access comprehensive financial education and policy insights to make informed decisions
            </p>
            <Button 
              onClick={() => setLoginOpen(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In to Access Resources
            </Button>
          </div>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Financial Resources & Education
          </h1>
          <p className="text-muted-foreground mb-6">
            Comprehensive financial education and policy insights to help you make informed decisions
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="education" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="education" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Financial Education
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Economic Policies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="education" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredEducationTopics.map(([key, topic]) => {
                const IconComponent = topic.icon;
                return (
                  <Card key={key} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                          <p className="text-muted-foreground text-sm">{topic.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {topic.content.map((section, index) => (
                          <div key={index}>
                            <h4 className="font-medium mb-2 text-foreground">{section.title}</h4>
                            <ul className="space-y-1">
                              {section.points.map((point, pointIndex) => (
                                <li key={pointIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
              {filteredPolicyTopics.map(([key, topic]) => {
                const IconComponent = topic.icon;
                return (
                  <Card key={key} className="rounded-xl shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                          <IconComponent className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                          <p className="text-muted-foreground">{topic.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        {topic.policies.map((policy, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{policy.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                Active
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <TrendingUp className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-orange-700 dark:text-orange-400">Impact</p>
                                  <p className="text-xs text-muted-foreground">{policy.impact}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Status</p>
                                  <p className="text-xs text-muted-foreground">{policy.currentStatus}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <div className="bg-accent/20 rounded-lg p-6">
            <Lightbulb className="h-8 w-8 mx-auto mb-3 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">Keep Learning</h3>
            <p className="text-muted-foreground text-sm">
              Financial education is an ongoing journey. Use these resources to make informed decisions and build a stronger financial future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}