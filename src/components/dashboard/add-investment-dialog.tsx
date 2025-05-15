
"use client";

import React, { useState, useTransition } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Investment } from "@/types";
import { PlusCircle, Sparkles, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { fetchStockData, type StockData } from '@/app/actions/fetch-stock-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const investmentSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long").toUpperCase(),
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  shares: z.coerce.number().positive("Shares must be positive"),
  avgPrice: z.coerce.number().positive("Purchase price must be positive"),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface AddInvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddInvestment: (investment: Investment) => void;
}

export function AddInvestmentDialog({ isOpen, onClose, onAddInvestment }: AddInvestmentDialogProps) {
  const [isFetchingRealTimePrice, startFetchingPriceTransition] = useTransition();
  const [fetchedStockInfo, setFetchedStockInfo] = useState<{ data?: StockData; error?: string | null } | null>(null);

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      symbol: "",
      name: "",
      shares: 0,
      avgPrice: 0,
    },
  });

  const handleFetchPrice = async () => {
    const symbol = form.getValues("symbol");
    if (!symbol) {
      form.setError("symbol", { type: "manual", message: "Symbol is required to fetch price." });
      return;
    }
    setFetchedStockInfo(null); // Clear previous info
    startFetchingPriceTransition(async () => {
      const result = await fetchStockData(symbol);
      setFetchedStockInfo(result);
      if (result.data?.price) {
        // Optionally prefill name if API provides it, or user can edit
        // For now, AlphaVantage GLOBAL_QUOTE doesn't return company name directly
      }
    });
  };
  
  const onSubmit = (data: InvestmentFormData) => {
    const newInvestment: Investment = {
      id: Date.now().toString(), // Simple ID generation
      ...data,
      currentPrice: fetchedStockInfo?.data?.price ?? data.avgPrice, // Use fetched price if available, else avgPrice
      logoUrl: `https://placehold.co/32x32.png?text=${data.symbol.substring(0,2)}`, 
    };
    onAddInvestment(newInvestment);
    form.reset();
    setFetchedStockInfo(null);
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
      setFetchedStockInfo(null);
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Add New Investment
          </DialogTitle>
          <DialogDescription>
            Enter stock details. You can fetch its current market price before adding.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Symbol</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., AAPL" {...field} className="flex-grow"/>
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleFetchPrice} 
                      disabled={isFetchingRealTimePrice || !field.value}
                      className="shrink-0"
                      aria-label="Fetch current price"
                    >
                      {isFetchingRealTimePrice ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrendingUp className="h-4 w-4" /> 
                      )}
                      <span className="ml-2 hidden sm:inline">Get Price</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isFetchingRealTimePrice && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching price...
              </div>
            )}

            {fetchedStockInfo?.error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Fetching Price</AlertTitle>
                <AlertDescription>{fetchedStockInfo.error}</AlertDescription>
              </Alert>
            )}

            {fetchedStockInfo?.data && (
              <Alert variant="default" className="mt-2 bg-primary/5 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Current Market Price</AlertTitle>
                <AlertDescription>
                  Symbol: {fetchedStockInfo.data.symbol}, Price: ${fetchedStockInfo.data.price.toFixed(2)}
                  {fetchedStockInfo.data.changePercent && ` (${fetchedStockInfo.data.changePercent})`}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apple Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Shares</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} step="any" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avgPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Average Purchase Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 150.75" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

