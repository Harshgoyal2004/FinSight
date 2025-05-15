import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { InvestmentRow } from "./investment-row";
import type { Investment } from "@/types";
import { mockInvestments } from "@/lib/mock-data";

export function InvestmentPortfolioCard() {
  if (mockInvestments.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Track your stock investments and simulate trades.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-40">
           <p className="text-muted-foreground mb-4">No investments added yet.</p>
          <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
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
          <Button variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
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
          {mockInvestments.map((investment) => (
            <InvestmentRow key={investment.id} investment={investment} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
