// src/ai/flows/personalized-investment-tips.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized investment tips and recommendations based on a user's portfolio and financial goals.
 *
 * - personalizedInvestmentTips - A function that calls the personalized investment tips flow.
 * - PersonalizedInvestmentTipsInput - The input type for the personalizedInvestmentTips function.
 * - PersonalizedInvestmentTipsOutput - The return type for the personalizedInvestmentTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedInvestmentTipsInputSchema = z.object({
  portfolioSummary: z
    .string()
    .describe("A summary of the user's current investment portfolio, including asset allocation and performance."),
  financialGoals: z
    .string()
    .describe('A description of the user\u2019s financial goals, risk tolerance, and investment timeline.'),
  spendingHabits: z.string().describe('A description of the user\u2019s spending habits.'),
});
export type PersonalizedInvestmentTipsInput = z.infer<
  typeof PersonalizedInvestmentTipsInputSchema
>;

const PersonalizedInvestmentTipsOutputSchema = z.object({
  investmentTips: z
    .string()
    .describe('Personalized investment tips and recommendations based on the user\u2019s portfolio and financial goals.'),
  riskAssessment: z
    .string()
    .describe('An assessment of the risk associated with the user\u2019s current investment strategy.'),
  recommendationsDisclaimer: z
    .string()
    .describe('A disclaimer that the investment tips are not financial advice and should be used at your own risk.'),
});
export type PersonalizedInvestmentTipsOutput = z.infer<
  typeof PersonalizedInvestmentTipsOutputSchema
>;

export async function personalizedInvestmentTips(
  input: PersonalizedInvestmentTipsInput
): Promise<PersonalizedInvestmentTipsOutput> {
  return personalizedInvestmentTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedInvestmentTipsPrompt',
  input: {schema: PersonalizedInvestmentTipsInputSchema},
  output: {schema: PersonalizedInvestmentTipsOutputSchema},
  prompt: `You are an AI investment advisor providing personalized investment tips.

  Based on the user's current portfolio summary, financial goals, and spending habits, provide personalized investment tips and recommendations.
  Also, include a risk assessment of the user's current investment strategy, and a disclaimer that the investment tips are not financial advice and should be used at your own risk.

  Portfolio Summary: {{{portfolioSummary}}}
  Financial Goals: {{{financialGoals}}}
  Spending Habits: {{{spendingHabits}}}

  investmentTips:
  riskAssessment:
  recommendationsDisclaimer:`,
});

const personalizedInvestmentTipsFlow = ai.defineFlow(
  {
    name: 'personalizedInvestmentTipsFlow',
    inputSchema: PersonalizedInvestmentTipsInputSchema,
    outputSchema: PersonalizedInvestmentTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
