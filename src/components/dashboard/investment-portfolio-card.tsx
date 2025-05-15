
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InvestmentRow } from "./investment-row";
import type { Investment } from "@/types";
import { mockInvestments as initialMockInvestments } from "@/lib/mock-data";
import { AddInvestmentDialog } from './add-investment-dialog';
import { BuyInvestmentDialog } from './buy-investment-dialog';
import { SellInvestmentDialog } from './sell-investment-dialog';
import { useToast } from "@/hooks/use-toast";
import { fetchStockData } from '@/app/actions/fetch-stock-data';

export function InvestmentPortfolioCard() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const { toast } = useToast();

  // Fetch initial prices for mock data
  useEffect(() => {
    const fetchInitialPrices = async () => {
      setIsLoadingInitialData(true);
      const updatedInvestments = await Promise.all(
        initialMockInvestments.map(async (inv) => {
          const { data, error } = await fetchStockData(inv.symbol);
          if (error) {
            console.warn(`Error fetching initial price for ${inv.symbol}: ${error}`);
            return inv; // Use mock price if API fails
          }
          return data ? { ...inv, currentPrice: data.price } : inv;
        })
      );
      setInvestments(updatedInvestments);
      setIsLoadingInitialData(false);
    };
    fetchInitialPrices();
  }, []);


  const handleAddInvestment = (newInvestment: Investment) => {
    if (investments.some(inv => inv.symbol.toUpperCase() === newInvestment.symbol.toUpperCase())) {
      toast({
        title: "Duplicate Investment",
        description: `An investment with the symbol ${newInvestment.symbol.toUpperCase()} already exists.`,
        variant: "destructive",
      });
      return;
    }
    // Immediately add to list, InvestmentRow will fetch live price
    setInvestments(prevInvestments => [...prevInvestments, newInvestment]);
    toast({
      title: "Investment Added",
      description: `${newInvestment.name} (${newInvestment.symbol}) has been added to your portfolio.`,
    });
  };

  const handleOpenBuyDialog = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsBuyDialogOpen(true);
  };

  const handleOpenSellDialog = (investment: Investment) => {
    setSelectedInvestment(investment);
    setIsSellDialogOpen(true);
  };

  const handleBuyShares = (investmentId: string, sharesBought: number, pricePerShare: number) => {
    setInvestments(prevInvestments =>
      prevInvestments.map(inv => {
        if (inv.id === investmentId) {
          const newTotalShares = inv.shares + sharesBought;
          const newAvgPrice = ((inv.shares * inv.avgPrice) + (sharesBought * pricePerShare)) / newTotalShares;
          toast({
            title: "Shares Purchased",
            description: `Bought ${sharesBought} shares of ${inv.symbol} at $${pricePerShare.toFixed(2)}.`,
          });
          return { ...inv, shares: newTotalShares, avgPrice: newAvgPrice };
        }
        return inv;
      })
    );
    setIsBuyDialogOpen(false);
  };

  const handleSellShares = (investmentId: string, sharesSold: number) => {
    setInvestments(prevInvestments => {
      const investmentToUpdate = prevInvestments.find(inv => inv.id === investmentId);
      if (!investmentToUpdate) return prevInvestments;

      if (sharesSold > investmentToUpdate.shares) {
        toast({
          title: "Sell Error",
          description: "Cannot sell more shares than you own.",
          variant: "destructive",
        });
        return prevInvestments;
      }
      
      const remainingShares = investmentToUpdate.shares - sharesSold;
      toast({
        title: "Shares Sold",
        description: `Sold ${sharesSold} shares of ${investmentToUpdate.symbol}.`,
      });

      if (remainingShares <= 0) {
        return prevInvestments.filter(inv => inv.id !== investmentId);
      } else {
        return prevInvestments.map(inv =>
          inv.id === investmentId ? { ...inv, shares: remainingShares } : inv
        );
      }
    });
    setIsSellDialogOpen(false);
  };


  if (isLoadingInitialData && investments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Loading portfolio data...</CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Fetching initial investment data...</p>
        </CardContent>
      </Card>
    );
  }


  if (investments.length === 0 && !isAddDialogOpen && !isLoadingInitialData) {
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
          <div className="hidden md:flex items-center justify-between p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <div className="w-2/5">Asset</div>
            <div className="w-1/5 text-right">Price</div>
            <div className="w-1/5 text-right">Value</div>
            <div className="w-1/5 text-right">Actions</div>
          </div>
          {investments.map((investment) => (
            <InvestmentRow 
              key={investment.id} 
              investment={investment}
              onBuy={() => handleOpenBuyDialog(investment)}
              onSell={() => handleOpenSellDialog(investment)}
            />
          ))}
        </CardContent>
      </Card>
      <AddInvestmentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddInvestment={handleAddInvestment}
      />
      <BuyInvestmentDialog
        isOpen={isBuyDialogOpen}
        onClose={() => setIsBuyDialogOpen(false)}
        onBuyShares={handleBuyShares}
        investment={selectedInvestment}
      />
      <SellInvestmentDialog
        isOpen={isSellDialogOpen}
        onClose={() => setIsSellDialogOpen(false)}
        onSellShares={handleSellShares}
        investment={selectedInvestment}
      />
    </section>
  );
}
