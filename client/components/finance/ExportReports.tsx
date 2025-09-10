import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  TrendingUp,
  Target
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ExportData {
  expenses: any[];
  budgets: any[];
  savingsGoals: any[];
  summary: {
    totalExpenses: number;
    totalBudget: number;
    savingsRate: number;
    period: string;
  };
}

export function ExportReports() {
  const { user, token } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [reportType, setReportType] = useState<"all" | "expenses" | "budgets" | "goals">("all");
  const [exportFormat, setExportFormat] = useState<"csv" | "txt" | "json">("csv");

  const fetchExportData = async (): Promise<ExportData> => {
    const [expensesRes, budgetsRes, goalsRes] = await Promise.all([
      fetch('/api/expenses', { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch('/api/budgets', { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch('/api/savings-goals', { headers: { 'Authorization': `Bearer ${token}` } })
    ]);

    const expenses = expensesRes.ok ? await expensesRes.json() : [];
    const budgets = budgetsRes.ok ? await budgetsRes.json() : [];
    const savingsGoals = goalsRes.ok ? await goalsRes.json() : [];

    const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    const totalBudget = budgets.reduce((sum: number, budget: any) => sum + budget.amount, 0);
    const savingsRate = totalBudget > 0 ? ((totalBudget - totalExpenses) / totalBudget) * 100 : 0;

    return {
      expenses,
      budgets,
      savingsGoals,
      summary: {
        totalExpenses,
        totalBudget,
        savingsRate,
        period: new Date().toLocaleDateString()
      }
    };
  };

  const generateCSV = (data: ExportData): string => {
    let csv = "";
    
    if (reportType === "all" || reportType === "expenses") {
      csv += "EXPENSE REPORT\\n";
      csv += "Date,Category,Description,Amount\\n";
      data.expenses.forEach((expense: any) => {
        csv += `${expense.date},${expense.category},"${expense.description}",${expense.amount}\\n`;
      });
      csv += "\\n";
    }

    if (reportType === "all" || reportType === "budgets") {
      csv += "BUDGET REPORT\\n";
      csv += "Category,Budgeted Amount,Spent Amount,Remaining,Status\\n";
      data.budgets.forEach((budget: any) => {
        const spent = data.expenses
          .filter((e: any) => e.category === budget.category)
          .reduce((sum: number, e: any) => sum + e.amount, 0);
        const remaining = budget.amount - spent;
        const status = remaining >= 0 ? "On Track" : "Over Budget";
        csv += `${budget.category},${budget.amount},${spent},${remaining},${status}\\n`;
      });
      csv += "\\n";
    }

    if (reportType === "all" || reportType === "goals") {
      csv += "SAVINGS GOALS REPORT\\n";
      csv += "Goal Name,Target Amount,Current Amount,Progress %,Target Date\\n";
      data.savingsGoals.forEach((goal: any) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        csv += `"${goal.name}",${goal.targetAmount},${goal.currentAmount},${progress.toFixed(1)},${goal.targetDate}\\n`;
      });
      csv += "\\n";
    }

    if (reportType === "all") {
      csv += "FINANCIAL SUMMARY\\n";
      csv += `Total Expenses,$${data.summary.totalExpenses.toLocaleString()}\\n`;
      csv += `Total Budget,$${data.summary.totalBudget.toLocaleString()}\\n`;
      csv += `Savings Rate,${data.summary.savingsRate.toFixed(1)}%\\n`;
      csv += `Report Generated,${data.summary.period}\\n`;
    }

    return csv;
  };

  const generateTXT = (data: ExportData): string => {
    let txt = "=".repeat(50) + "\\n";
    txt += "           PERSONAL FINANCE REPORT\\n";
    txt += "=".repeat(50) + "\\n\\n";

    if (reportType === "all" || reportType === "expenses") {
      txt += "💰 EXPENSE SUMMARY\\n";
      txt += "-".repeat(30) + "\\n";
      data.expenses.forEach((expense: any) => {
        txt += `${expense.date.padEnd(12)} | ${expense.category.padEnd(15)} | $${expense.amount.toString().padStart(8)} | ${expense.description}\\n`;
      });
      txt += "\\n";
    }

    if (reportType === "all" || reportType === "budgets") {
      txt += "📊 BUDGET ANALYSIS\\n";
      txt += "-".repeat(30) + "\\n";
      data.budgets.forEach((budget: any) => {
        const spent = data.expenses
          .filter((e: any) => e.category === budget.category)
          .reduce((sum: number, e: any) => sum + e.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;
        const status = remaining >= 0 ? "✅" : "❌";
        
        txt += `${status} ${budget.category}\\n`;
        txt += `   Budget: $${budget.amount}  |  Spent: $${spent}  |  Used: ${percentage.toFixed(1)}%\\n`;
        txt += `   Remaining: $${remaining}\\n\\n`;
      });
    }

    if (reportType === "all" || reportType === "goals") {
      txt += "🎯 SAVINGS GOALS\\n";
      txt += "-".repeat(30) + "\\n";
      data.savingsGoals.forEach((goal: any) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const progressBar = "█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10));
        
        txt += `${goal.name}\\n`;
        txt += `   Progress: [${progressBar}] ${progress.toFixed(1)}%\\n`;
        txt += `   Amount: $${goal.currentAmount} / $${goal.targetAmount}\\n`;
        txt += `   Target Date: ${goal.targetDate}\\n\\n`;
      });
    }

    if (reportType === "all") {
      txt += "📈 FINANCIAL OVERVIEW\\n";
      txt += "-".repeat(30) + "\\n";
      txt += `Total Monthly Expenses: $${data.summary.totalExpenses.toLocaleString()}\\n`;
      txt += `Total Monthly Budget: $${data.summary.totalBudget.toLocaleString()}\\n`;
      txt += `Savings Rate: ${data.summary.savingsRate.toFixed(1)}%\\n`;
      txt += `Financial Health: ${data.summary.savingsRate >= 20 ? "Excellent 🔥" : data.summary.savingsRate >= 10 ? "Good 👍" : "Needs Improvement 📈"}\\n`;
    }

    txt += "\\n" + "=".repeat(50) + "\\n";
    txt += `Report generated on ${data.summary.period}\\n`;
    txt += "Generated by Budget Planner Pro\\n";

    return txt;
  };

  const generateJSON = (data: ExportData): string => {
    const reportData = {
      reportType,
      generatedAt: new Date().toISOString(),
      user: user?.email || "Unknown",
      ...data
    };
    return JSON.stringify(reportData, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!user || !token) {
      toast.error("Please log in to export reports");
      return;
    }

    setExporting(true);
    try {
      const data = await fetchExportData();
      
      let content: string;
      let filename: string;
      let mimeType: string;

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const reportTypeText = reportType === "all" ? "Complete" : reportType.charAt(0).toUpperCase() + reportType.slice(1);

      switch (exportFormat) {
        case "csv":
          content = generateCSV(data);
          filename = `${reportTypeText}_Financial_Report_${timestamp}.csv`;
          mimeType = "text/csv";
          break;
        case "txt":
          content = generateTXT(data);
          filename = `${reportTypeText}_Financial_Report_${timestamp}.txt`;
          mimeType = "text/plain";
          break;
        case "json":
          content = generateJSON(data);
          filename = `${reportTypeText}_Financial_Report_${timestamp}.json`;
          mimeType = "application/json";
          break;
        default:
          throw new Error("Invalid export format");
      }

      downloadFile(content, filename, mimeType);
      toast.success(`${reportTypeText} report exported successfully! 📄`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case "expenses":
        return "Export all your tracked expenses with categories and dates";
      case "budgets":
        return "Export budget vs actual spending analysis";
      case "goals":
        return "Export savings goals progress and target dates";
      default:
        return "Export complete financial overview including expenses, budgets, and goals";
    }
  };

  const getFormatDescription = () => {
    switch (exportFormat) {
      case "csv":
        return "Spreadsheet format - perfect for Excel or Google Sheets analysis";
      case "txt":
        return "Human-readable format with charts and summaries";
      case "json":
        return "Technical format for developers and data analysis";
      default:
        return "";
    }
  };

  if (!user) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Export Financial Reports</h3>
            <p className="text-muted-foreground">Please log in to export your financial data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Financial Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Report Type</label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Complete Financial Report
                  </div>
                </SelectItem>
                <SelectItem value="expenses">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Expenses Only
                  </div>
                </SelectItem>
                <SelectItem value="budgets">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Budget Analysis
                  </div>
                </SelectItem>
                <SelectItem value="goals">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Savings Goals
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {getReportDescription()}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Spreadsheet)
                  </div>
                </SelectItem>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    TXT (Report)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (Data)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {getFormatDescription()}
            </p>
          </div>
        </div>

        <div className="bg-accent/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Preview: {reportType === "all" ? "Complete" : reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </h4>
          <div className="flex flex-wrap gap-2">
            {(reportType === "all" || reportType === "expenses") && (
              <Badge variant="outline">📊 Expense Tracking</Badge>
            )}
            {(reportType === "all" || reportType === "budgets") && (
              <Badge variant="outline">💰 Budget Analysis</Badge>
            )}
            {(reportType === "all" || reportType === "goals") && (
              <Badge variant="outline">🎯 Savings Goals</Badge>
            )}
            {reportType === "all" && (
              <Badge variant="outline">📈 Financial Summary</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Your data will be exported in {exportFormat.toUpperCase()} format with all relevant financial information.
          </p>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={exporting}
          className="w-full"
          size="lg"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export {reportType === "all" ? "Complete" : reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Reports include data up to {new Date().toLocaleDateString()} • 
            Your data stays private and secure
          </p>
        </div>
      </CardContent>
    </Card>
  );
}