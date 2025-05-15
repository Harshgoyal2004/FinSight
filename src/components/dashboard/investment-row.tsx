
"use client";

import Image from 'next/image';
import type { Investment } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useTransition } from 'react';
import { fetchStockData, type StockData } from '@/app/actions/fetch-stock-data';
import { Skeleton } from "@/components/ui/skeleton";

interface InvestmentRowProps {
  investment: Investment;
}

export function InvestmentRow({ investment }: InvestmentRowProps) {
  const [liveStockData, setLiveStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const currentPriceToUse = liveStockData?.price ?? investment.currentPrice;
  const apiChangePercent = liveStockData?.changePercent;

  const totalValue = investment.shares * currentPriceToUse;
  const totalCost = investment.shares * investment.avgPrice;
  const gainLossAbsolute = totalValue - totalCost;
  const gainLossPercentFromPurchase = totalCost > 0 ? (gainLossAbsolute / totalCost) * 100 : 0;

  let PerformanceIconTotal = Minus;
  let performanceColorTotal = "text-muted-foreground";

  if (gainLossPercentFromPurchase > 0) {
    PerformanceIconTotal = ArrowUpRight;
    performanceColorTotal = "text-green-500";
  } else if (gainLossPercentFromPurchase < 0) {
    PerformanceIconTotal = ArrowDownRight;
    performanceColorTotal = "text-red-500";
  }
  
  const fetchData = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoading(true);
    setError(null);
    try {
      const result = await fetchStockData(investment.symbol);
      if (result.error) {
        setError(result.error);
        // Keep existing liveStockData on error if it exists, so price doesn't disappear
      } else if (result.data) {
        setLiveStockData(result.data);
      }
    } catch (e) {
      setError("Client-side error fetching data.");
    } finally {
      if (showLoadingIndicator) setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investment.symbol]); // Only re-fetch if the symbol itself changes

  const handleRefresh = () => {
    startRefreshTransition(async () => {
      await fetchData(false); // Don't show main loading skeleton on manual refresh
    });
  };

  const displayPrice = currentPriceToUse.toFixed(2);
  const displayTotalValue = totalValue.toFixed(2);

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
      {/* Asset Info */}
      <div className="flex items-center gap-3 w-full md:w-2/5 mb-3 md:mb-0">
        {investment.logoUrl && (
          <Image 
            src={investment.logoUrl} 
            alt={`${investment.name} logo`} 
            width={32} 
            height={32} 
            className="rounded-full"
            data-ai-hint="company logo" 
          />
        )}
        <div>
          <p className="font-semibold text-foreground">{investment.symbol}</p>
          <p className="text-xs text-muted-foreground">{investment.name}</p>
        </div>
      </div>

      {/* Current Price & Daily Change */}
      <div className="text-left md:text-right w-full md:w-1/5 mb-2 md:mb-0">
        {isLoading && !liveStockData ? (
          <>
            <Skeleton className="h-5 w-20 mb-1 md:ml-auto" />
            <Skeleton className="h-3 w-16 md:ml-auto" />
          </>
        ) : error && !liveStockData ? ( // Only show error if no data at all
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          <>
            <p className="font-medium text-foreground">${displayPrice}</p>
            {apiChangePercent ? (
                 <p className={cn("text-xs flex items-center md:justify-end", parseFloat(apiChangePercent) > 0 ? "text-green-500" : parseFloat(apiChangePercent) < 0 ? "text-red-500" : "text-muted-foreground")}>
                  {parseFloat(apiChangePercent) > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : parseFloat(apiChangePercent) < 0 ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                  {apiChangePercent} (Daily)
                </p>
            ) : (
              <p className={cn("text-xs flex items-center md:justify-end", performanceColorTotal)}>
                <PerformanceIconTotal className="h-3 w-3 mr-1" /> 
                {gainLossPercentFromPurchase.toFixed(2)}% (Total)
              </p>
            )}
          </>
        )}
      </div>
      
      {/* Total Value & Shares */}
      <div className="text-left md:text-right w-full md:w-1/5 mb-3 md:mb-0">
        {isLoading && !liveStockData ? (
            <>
              <Skeleton className="h-5 w-24 mb-1 md:ml-auto" />
              <Skeleton className="h-3 w-12 md:ml-auto" />
            </>
        ): (
           <>
            <p className="font-medium text-foreground">${displayTotalValue}</p>
            <p className="text-xs text-muted-foreground">{investment.shares} shares</p>
           </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 sm:gap-2 w-full md:w-auto justify-start md:justify-end items-center">
        <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 grow md:grow-0">
          Buy
        </Button>
        <Button variant="outline" size="sm" className="grow md:grow-0">
          Sell
        </Button>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing || (isLoading && !isRefreshing)} aria-label="Refresh price" className="md:ml-1">
          <RefreshCw className={cn("h-4 w-4", (isRefreshing || (isLoading && !isRefreshing)) && "animate-spin")} />
        </Button>
      </div>
      
      {/* Error message for mobile, if not shown in price column */}
      {error && liveStockData && ( // Show error here if there was previous data
        <div className="w-full text-xs text-destructive mt-2 md:hidden text-center p-1 bg-destructive/10 rounded">
            Update failed: {error} Using last known price.
        </div>
      )}
    </div>
  );
}
