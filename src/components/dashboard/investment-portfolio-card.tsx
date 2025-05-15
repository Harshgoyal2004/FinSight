
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InvestmentRow } from "./investment-row";
import type { Investment } from "@/types";
import { mockInvestments as initialMockInvestments } from "@/lib/mock-data";
import { AddInvestmentDialog } from './add-investment-dialog'; // Import the new dialog
import { useToast } from "@/hooks/use-toast";

export function InvestmentPortfolioCard() {
  const [investments, setInvestments] = useState<Investment[]>(initialMockInvestments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddInvestment = (newInvestment: Investment) => {
    // Check for duplicate symbol before adding
    if (investments.some(inv => inv.symbol.toUpperCase() === newInvestment.symbol.toUpperCase())) {
      toast({
        title: "Duplicate Investment",
        description: `An investment with the symbol ${newInvestment.symbol.toUpperCase()} already exists.`,
        variant: "destructive",
      });
      return;
    }
    setInvestments(prevInvestments => [...prevInvestments, newInvestment]);
    toast({
      title: "Investment Added",
      description: `${newInvestment.name} (${newInvestment.symbol}) has been added to your portfolio.`,
      variant: "default",
    });
  };

  if (investments.length === 0 && !isAddDialogOpen) { // Ensure dialog can still open if list is empty
    return (
       <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Track your stock investments and simulate trades.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40">
           <p className="text-muted-foreground mb-4">No investments added yet.</p>
          <Button 
            variant="outline" 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Investment
          </Button>
           <AddInvestmentDialog
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onAddInvestment={handleAddInvestment}
          />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <section id="investments" className="scroll-mt-20">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Investment Portfolio</CardTitle>
            <CardDescription>Track your stock investments and simulate trades.</CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Investment
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {/* Header for table-like layout */}
          <div className="hidden md:flex items-center justify-between p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <div className="w-2/5">Asset</div>
            <div className="w-1/5 text-right">Price</div>
            <div className="w-1/5 text-right">Value</div>
            <div className="w-1/5 text-right">Actions</div>
          </div>
          {investments.map((investment) => (
            <InvestmentRow key={investment.id} investment={investment} />
          ))}
        </CardContent>
      </Card>
      <AddInvestmentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddInvestment={handleAddInvestment}
      />
    </section>
  );
}
