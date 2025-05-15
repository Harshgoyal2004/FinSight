import Image from 'next/image';
import type { Investment } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestmentRowProps {
  investment: Investment;
}

export function InvestmentRow({ investment }: InvestmentRowProps) {
  const totalValue = investment.shares * investment.currentPrice;
  const totalCost = investment.shares * investment.avgPrice;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

  let PerformanceIcon = Minus;
  let performanceColor = "text-muted-foreground";

  if (gainLoss > 0) {
    PerformanceIcon = ArrowUpRight;
    performanceColor = "text-green-500";
  } else if (gainLoss < 0) {
    PerformanceIcon = ArrowDownRight;
    performanceColor = "text-red-500";
  }

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
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
      <div className="text-right hidden md:block">
        <p className="font-medium text-foreground">${investment.currentPrice.toFixed(2)}</p>
        <p className={cn("text-xs flex items-center justify-end", performanceColor)}>
          <PerformanceIcon className="h-3 w-3 mr-1" /> 
          {gainLossPercent.toFixed(2)}%
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium text-foreground">${totalValue.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">{investment.shares} shares</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          Buy
        </Button>
        <Button variant="outline" size="sm">
          Sell
        </Button>
      </div>
    </div>
  );
}
