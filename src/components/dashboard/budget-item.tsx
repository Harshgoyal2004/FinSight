"use client"

import type { Budget } from "@/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetItemProps {
  budget: Budget;
}

export function BudgetItem({ budget }: BudgetItemProps) {
  const progressPercentage = Math.min((budget.spent / budget.limit) * 100, 100);
  const isExceeded = budget.spent > budget.limit;

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-card-foreground">{budget.category}</span>
        <span className={cn(
          "text-sm font-semibold",
          isExceeded ? "text-destructive" : "text-foreground"
        )}>
          ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
        </span>
      </div>
      <Progress 
        value={progressPercentage} 
        className={cn(
          "h-3 rounded-full",
           isExceeded ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"
        )} 
        aria-label={`${budget.category} budget progress`}
      />
      {isExceeded && (
        <p className="text-xs text-destructive mt-1">
          You've exceeded this budget by ${(budget.spent - budget.limit).toFixed(2)}.
        </p>
      )}
    </div>
  );
}
