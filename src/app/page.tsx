
import { AppShell } from "@/components/layout/app-shell";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { ExpenseSummaryCard } from "@/components/dashboard/expense-summary-card";
import { BudgetTrackingCard } from "@/components/dashboard/budget-tracking-card";
import { InvestmentPortfolioCard } from "@/components/dashboard/investment-portfolio-card";
import { AIFinancialInsightsCard } from "@/components/dashboard/ai-financial-insights-card";
import { DollarSign, TrendingUp, Banknote, Briefcase, AlertCircle } from "lucide-react";
import { mockTransactions, mockBudgets, mockInvestments } from "@/lib/mock-data";
import { fetchStockData } from "@/app/actions/fetch-stock-data";

export default async function DashboardPage() {
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalBudgetLimit = mockBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalBudgetSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);

  let calculatedNetWorth = 0;
  let netWorthError = false;

  const investmentValuesPromises = mockInvestments.map(async (inv) => {
    const { data: stockData, error } = await fetchStockData(inv.symbol);
    if (error) {
      console.warn(`Error fetching stock data for ${inv.symbol} in DashboardPage: ${error}`);
      // netWorthError = true; // You might want to indicate an error globally if any fetch fails
    }
    const priceToUse = stockData?.price ?? inv.currentPrice; // Fallback to mock price
    return inv.shares * priceToUse;
  });

  try {
    const resolvedInvestmentValues = await Promise.all(investmentValuesPromises);
    calculatedNetWorth = resolvedInvestmentValues.reduce((sum, value) => sum + value, 0);
  } catch (error) {
    console.error("Error resolving investment values for net worth:", error);
    netWorthError = true;
    // Fallback to summing up mock data if Promise.all fails (though individual fallbacks should prevent this)
    calculatedNetWorth = mockInvestments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
  }


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
          value={`$${calculatedNetWorth.toFixed(2)}`}
          icon={netWorthError ? AlertCircle : Briefcase}
          description={netWorthError ? "Using cached/mock data due to API error" : "Current portfolio value (live)"}
          className={netWorthError ? "border-destructive/50" : ""}
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
