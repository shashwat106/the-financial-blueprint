import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BudgetPage from "./pages/Budget";
import ExpensesPage from "./pages/Expenses";
import NewsPage from "./pages/News";
import FinancialResourcesPage from "./pages/FinancialResources";
import ConnectPage from "./pages/Connect";
import TipsPage from "./pages/Tips";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/site/Layout";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="finsight-theme">
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/resources" element={<FinancialResourcesPage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/tips" element={<TipsPage />} />
              <Route path="/news" element={<NewsPage />} />
              {/* Legacy routes for backwards compatibility */}
              <Route path="/education" element={<FinancialResourcesPage />} />
              <Route path="/policies" element={<FinancialResourcesPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
