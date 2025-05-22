// The AI Budget Assistant analyzes spending patterns and suggests conservative budget adjustments.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBudgetAdjustmentsInputSchema = z.object({
  income: z.number().describe('Total monthly income.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('The category of the expense.'),
      amount: z.number().describe('The amount spent in the category.'),
      budget: z.number().describe('The current monthly budget for the category.'),
    })
  ).describe('An array of expenses with category, amount spent and budget.'),
});
export type SuggestBudgetAdjustmentsInput = z.infer<typeof SuggestBudgetAdjustmentsInputSchema>;

const SuggestBudgetAdjustmentsOutputSchema = z.array(
  z.object({
    category: z.string().describe('The category of the expense.'),
    suggestedAdjustment: z.number().describe('The suggested budget adjustment amount (can be positive or negative).'),
    explanation: z.string().describe('The explanation for the suggested adjustment.'),
  })
).describe('An array of suggested budget adjustments with explanations.');
export type SuggestBudgetAdjustmentsOutput = z.infer<typeof SuggestBudgetAdjustmentsOutputSchema>;

export async function suggestBudgetAdjustments(input: SuggestBudgetAdjustmentsInput): Promise<SuggestBudgetAdjustmentsOutput> {
  return suggestBudgetAdjustmentsFlow(input);
}

const suggestBudgetAdjustmentsPrompt = ai.definePrompt({
  name: 'suggestBudgetAdjustmentsPrompt',
  input: {schema: SuggestBudgetAdjustmentsInputSchema},
  output: {schema: SuggestBudgetAdjustmentsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income and expenses to suggest budget adjustments.

Income: {{{income}}}
Expenses:
{{#each expenses}}
- Category: {{category}}, Amount Spent: {{amount}}, Budget: {{budget}}
{{/each}}

Suggest conservative adjustments to the budget for each category to optimize spending and savings. Explain each suggestion.
Respond in JSON format.
`,
});

const suggestBudgetAdjustmentsFlow = ai.defineFlow(
  {
    name: 'suggestBudgetAdjustmentsFlow',
    inputSchema: SuggestBudgetAdjustmentsInputSchema,
    outputSchema: SuggestBudgetAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await suggestBudgetAdjustmentsPrompt(input);
    return output!;
  }
);
