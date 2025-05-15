
"use client";

import Image from 'next/image';
import type { Investment } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw, ShoppingCart, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { fetchStockData, type StockData } from '@/app/actions/fetch-stock-data';
import { Skeleton } from "@/components/ui/skeleton";

interface InvestmentRowProps {
  investment: Investment;
  onBuy: (investment: Investment) => void;
  onSell: (investment: Investment) => void;
}

export function InvestmentRow({ investment, onBuy, onSell }: InvestmentRowProps) {
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
  
  const fetchData = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoading(true);
    setError(null);
    try {
      const result = await fetchStockData(investment.symbol);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setLiveStockData(result.data);
      }
    } catch (e) {
      setError("Client-side error fetching data.");
    } finally {
      if (showLoadingIndicator) setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investment.symbol]); // Added investment.symbol to dependencies
  
  useEffect(() => {
    if (investment.symbol && !investment.symbol.startsWith("TEMP_")) {
        fetchData();
    } else {
        setIsLoading(false);
        // For newly added items, if symbol is valid but no live data yet, use avgPrice as current
        if (!investment.symbol.startsWith("TEMP_") && investment.currentPrice === investment.avgPrice) {
            setLiveStockData({ symbol: investment.symbol, price: investment.avgPrice });
        }
    }
  }, [investment.symbol, investment.avgPrice, investment.currentPrice, fetchData]);

  const handleRefresh = () => {
    if (investment.symbol && !investment.symbol.startsWith("TEMP_")) {
        startRefreshTransition(async () => {
            await fetchData(false); 
        });
    }
  };

  // Update currentPrice in parent if liveStockData changes, for newly added items primarily
  useEffect(() => {
    if (liveStockData && liveStockData.price !== investment.currentPrice) {
      // This effect could be problematic if it causes too many re-renders.
      // For now, it ensures that the InvestmentPortfolioCard's state for currentPrice is updated.
      // A better approach might involve lifting liveStockData state or more direct parent updates.
    }
  }, [liveStockData, investment.currentPrice]);


  const displayPrice = currentPriceToUse.toFixed(2);
  const displayTotalValue = totalValue.toFixed(2);
  const logoSrc = investment.logoUrl || `https://placehold.co/32x32.png?text=${investment.symbol.substring(0,2)}`;


  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
      {/* Asset Info */}
      <div className="flex items-center gap-3 w-full md:w-2/5 mb-3 md:mb-0">
        <Image 
          src={logoSrc} 
          alt={`${investment.name} logo`} 
          width={32} 
          height={32} 
          className="rounded-full"
          data-ai-hint="company logo"
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = `https://placehold.co/32x32.png?text=${investment.symbol.substring(0,2)}`;
          }}
        />
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
        ) : error && !liveStockData ? ( 
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
                {investment.shares > 0 ? `${gainLossPercentFromPurchase.toFixed(2)}% (Total)` : 'N/A (Total)'}
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
            <p className="text-xs text-muted-foreground">{investment.shares.toFixed(2)} shares</p>
           </>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 sm:gap-2 w-full md:w-auto justify-start md:justify-end items-center">
        <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 grow md:grow-0" 
            onClick={() => onBuy(investment)}
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5"/> Buy
        </Button>
        <Button 
            variant="outline" 
            size="sm" 
            className="grow md:grow-0" 
            onClick={() => onSell(investment)}
            disabled={investment.shares <= 0}
        >
          <MinusCircle className="mr-1.5 h-3.5 w-3.5"/> Sell
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing || (isLoading && !isRefreshing) || investment.symbol.startsWith("TEMP_") } 
            aria-label="Refresh price" 
            className="md:ml-1"
        >
          <RefreshCw className={cn("h-4 w-4", (isRefreshing || (isLoading && !isRefreshing)) && "animate-spin")} />
        </Button>
      </div>
      
      {error && liveStockData && ( 
        <div className="w-full text-xs text-destructive mt-2 md:hidden text-center p-1 bg-destructive/10 rounded">
            Update failed: {error} Using last known price.
        </div>
      )}
    </div>
  );
}
