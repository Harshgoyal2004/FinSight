"use client"

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, FileText, BarChartBig } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { summarizeSpendingHabits, SummarizeSpendingHabitsOutput } from '@/ai/flows/summarize-spending-habits';
import { personalizedInvestmentTips, PersonalizedInvestmentTipsOutput } from '@/ai/flows/personalized-investment-tips';
import { 
  mockPortfolioSummary, 
  mockFinancialGoals, 
  mockSpendingHabitsForAI, 
  getDemoMonthlySpendingData
} from '@/lib/mock-data';

export function AIFinancialInsightsCard() {
  const [spendingSummary, setSpendingSummary] = useState<SummarizeSpendingHabitsOutput | null>(null);
  const [investmentTips, setInvestmentTips] = useState<PersonalizedInvestmentTipsOutput | null>(null);
  const [isSpendingLoading, startSpendingTransition] = useTransition();
  const [isInvestmentLoading, startInvestmentTransition] = useTransition();
  const [spendingError, setSpendingError] = useState<string | null>(null);
  const [investmentError, setInvestmentError] = useState<string | null>(null);

  const handleSummarizeSpending = async () => {
    setSpendingError(null);
    startSpendingTransition(async () => {
      try {
        const result = await summarizeSpendingHabits({
          userId: 'demo-user',
          monthlySpendingData: getDemoMonthlySpendingData(),
        });
        setSpendingSummary(result);
      } catch (error) {
        console.error("Error fetching spending summary:", error);
        setSpendingError("Failed to generate spending summary. Please try again.");
      }
    });
  };

  const handleGetInvestmentTips = async () => {
    setInvestmentError(null);
    startInvestmentTransition(async () => {
      try {
        const result = await personalizedInvestmentTips({
          portfolioSummary: mockPortfolioSummary,
          financialGoals: mockFinancialGoals,
          spendingHabits: mockSpendingHabitsForAI,
        });
        setInvestmentTips(result);
      } catch (error) {
        console.error("Error fetching investment tips:", error);
        setInvestmentError("Failed to generate investment tips. Please try again.");
      }
    });
  };

  return (
    <section id="insights" className="scroll-mt-20">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">AI Financial Insights</CardTitle>
          </div>
          <CardDescription>Personalized advice to help you manage your finances better.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="spending" className="gap-1">
                <BarChartBig className="h-4 w-4" /> Spending Analysis
              </TabsTrigger>
              <TabsTrigger value="investment" className="gap-1">
                <FileText className="h-4 w-4" /> Investment Tips
              </TabsTrigger>
            </TabsList>
            <TabsContent value="spending">
              <div className="space-y-4">
                {!spendingSummary && !isSpendingLoading && (
                  <p className="text-sm text-muted-foreground">
                    Get a summary of your spending habits and identify potential savings.
                  </p>
                )}
                {isSpendingLoading && (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Generating summary...</p>
                  </div>
                )}
                {spendingError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{spendingError}</AlertDescription>
                  </Alert>
                )}
                {spendingSummary && !isSpendingLoading && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertTitle className="font-semibold text-primary">Spending Habits Summary</AlertTitle>
                    <AlertDescription className="text-foreground whitespace-pre-wrap">
                      {spendingSummary.summary}
                    </AlertDescription>
                  </Alert>
                )}
                <Button 
                  onClick={handleSummarizeSpending} 
                  disabled={isSpendingLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSpendingLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BarChartBig className="mr-2 h-4 w-4" />
                  )}
                  Generate Spending Summary
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="investment">
              <div className="space-y-4">
                {!investmentTips && !isInvestmentLoading && (
                  <p className="text-sm text-muted-foreground">
                    Receive personalized investment tips based on your portfolio and goals.
                  </p>
                )}
                {isInvestmentLoading && (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <p className="ml-2 text-muted-foreground">Fetching tips...</p>
                  </div>
                )}
                {investmentError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{investmentError}</AlertDescription>
                  </Alert>
                )}
                {investmentTips && !isInvestmentLoading && (
                  <div className="space-y-3">
                    <Alert className="bg-primary/5 border-primary/20">
                      <AlertTitle className="font-semibold text-primary">Investment Tips</AlertTitle>
                      <AlertDescription className="text-foreground whitespace-pre-wrap">
                        {investmentTips.investmentTips}
                      </AlertDescription>
                    </Alert>
                    <Alert variant="default" className="bg-secondary/50 border-secondary">
                      <AlertTitle className="font-semibold text-secondary-foreground">Risk Assessment</AlertTitle>
                      <AlertDescription className="text-muted-foreground whitespace-pre-wrap">
                        {investmentTips.riskAssessment}
                      </AlertDescription>
                    </Alert>
                     <Alert variant="default" className="bg-muted/50 border-muted">
                      <AlertTitle className="font-semibold text-muted-foreground">Disclaimer</AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {investmentTips.recommendationsDisclaimer}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                <Button 
                  onClick={handleGetInvestmentTips} 
                  disabled={isInvestmentLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isInvestmentLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Get Investment Tips
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
