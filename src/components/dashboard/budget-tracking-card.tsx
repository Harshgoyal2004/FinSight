"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { BudgetItem } from "./budget-item";
import type { Budget } from "@/types";
import { mockBudgets } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from 'react';


export function BudgetTrackingCard() {
  const { toast } = useToast();

  useEffect(() => {
    mockBudgets.forEach(budget => {
      if (budget.spent > budget.limit) {
        toast({
          title: "Budget Alert",
          description: `You've exceeded your budget for ${budget.category} by $${(budget.spent - budget.limit).toFixed(2)}.`,
          variant: "destructive",
        });
      } else if (budget.spent / budget.limit >= 0.9) {
         toast({
          title: "Budget Warning",
          description: `You've used ${((budget.spent / budget.limit) * 100).toFixed(0)}% of your budget for ${budget.category}.`,
          variant: "default", // Or a custom "warning" variant if defined
        });
      }
    });
  }, [toast]);


  if (mockBudgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Tracking</CardTitle>
          <CardDescription>Monitor your spending against your set budgets.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground mb-4">No budgets set up yet.</p>
          <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Budget
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <section id="budgets" className="scroll-mt-20">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Budget Tracking</CardTitle>
            <CardDescription>Monitor your spending against your set budgets.</CardDescription>
          </div>
          <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" /> New Budget
          </Button>
        </CardHeader>
        <CardContent>
          {mockBudgets.map((budget) => (
            <BudgetItem key={budget.id} budget={budget} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
