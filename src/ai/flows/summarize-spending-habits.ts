// src/ai/flows/summarize-spending-habits.ts
'use server';

/**
 * @fileOverview Generates a monthly summary of a user's spending habits,
 * highlighting key trends and potential savings areas.
 *
 * - summarizeSpendingHabits - A function that generates the spending summary.
 * - SummarizeSpendingHabitsInput - The input type for the summarizeSpendingHabits function.
 * - SummarizeSpendingHabitsOutput - The return type for the summarizeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingHabitsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  monthlySpendingData: z.string().describe('The user\'s monthly spending data in JSON format.'),
});
export type SummarizeSpendingHabitsInput = z.infer<typeof SummarizeSpendingHabitsInputSchema>;

const SummarizeSpendingHabitsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s spending habits, including key trends and areas for potential savings.'),
});
export type SummarizeSpendingHabitsOutput = z.infer<typeof SummarizeSpendingHabitsOutputSchema>;

export async function summarizeSpendingHabits(input: SummarizeSpendingHabitsInput): Promise<SummarizeSpendingHabitsOutput> {
  return summarizeSpendingHabitsFlow(input);
}

const summarizeSpendingHabitsPrompt = ai.definePrompt({
  name: 'summarizeSpendingHabitsPrompt',
  input: {schema: SummarizeSpendingHabitsInputSchema},
  output: {schema: SummarizeSpendingHabitsOutputSchema},
  prompt: `You are a personal finance advisor. Please provide a monthly summary of the user's spending habits, highlighting key trends and areas where they can save money.

  User ID: {{{userId}}}
  Monthly Spending Data: {{{monthlySpendingData}}}
  \n`,
});

const summarizeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingHabitsFlow',
    inputSchema: SummarizeSpendingHabitsInputSchema,
    outputSchema: SummarizeSpendingHabitsOutputSchema,
  },
  async input => {
    const {output} = await summarizeSpendingHabitsPrompt(input);
    return output!;
  }
);
