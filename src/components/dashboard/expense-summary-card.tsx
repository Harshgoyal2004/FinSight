import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryExpenseChart } from "./category-expense-chart";
import { SpendingTrendChart } from "./spending-trend-chart";
import { mockCategoryExpenseData, mockSpendingTrendData } from "@/lib/mock-data";

export function ExpenseSummaryCard() {
  return (
    <section id="expenses" className="scroll-mt-20">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <CategoryExpenseChart data={mockCategoryExpenseData} />
        <SpendingTrendChart data={mockSpendingTrendData} />
      </div>
    </section>
  );
}
