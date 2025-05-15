import { AppShell } from "@/components/layout/app-shell";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { ExpenseSummaryCard } from "@/components/dashboard/expense-summary-card";
import { BudgetTrackingCard } from "@/components/dashboard/budget-tracking-card";
import { InvestmentPortfolioCard } from "@/components/dashboard/investment-portfolio-card";
import { AIFinancialInsightsCard } from "@/components/dashboard/ai-financial-insights-card";
import { DollarSign, TrendingUp, Banknote, Briefcase } from "lucide-react";
import { mockTransactions, mockBudgets, mockInvestments } from "@/lib/mock-data";

export default function DashboardPage() {
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netWorth = mockInvestments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0); // Simplified

  const totalBudgetLimit = mockBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);


  return (
    <AppShell pageTitle="Dashboard Overview">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <OverviewCard
          title="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          icon={DollarSign}
          description="Current month's income"
        />
        <OverviewCard
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          icon={TrendingUp}
          description="Current month's spending"
        />
        <OverviewCard
          title="Budget Utilization"
          value={`${((totalBudgetSpent / totalBudgetLimit) * 100 || 0).toFixed(0)}%`}
          icon={Banknote}
          description={`$${totalBudgetSpent.toFixed(2)} of $${totalBudgetLimit.toFixed(2)}`}
        />
        <OverviewCard
          title="Investment Value"
          value={`$${netWorth.toFixed(2)}`}
          icon={Briefcase}
          description="Current portfolio value"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ExpenseSummaryCard />
        <div className="grid gap-8 lg:grid-cols-2">
          <BudgetTrackingCard />
          <InvestmentPortfolioCard />
        </div>
        <AIFinancialInsightsCard />
      </div>
    </AppShell>
  );
}
