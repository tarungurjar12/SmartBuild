'use server';
/**
 * @fileOverview AI-driven suggestions for optimal reorder quantities to avoid overstocking or running out of essential building materials.
 *
 * - getReorderSuggestions - A function that handles the reorder suggestion process.
 * - GetReorderSuggestionsInput - The input type for the getReorderSuggestions function.
 * - GetReorderSuggestionsOutput - The return type for the getReorderSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetReorderSuggestionsInputSchema = z.object({
  productId: z.string().describe('The ID of the product to get reorder suggestions for.'),
  variantId: z.string().describe('The ID of the product variant to get reorder suggestions for.'),
  productName: z.string().describe('The name of the product.'),
  variantDetails: z.string().describe('The details of the product variant (e.g., size, color).'),
  quantityInStock: z.number().describe('The current quantity in stock for this variant.'),
  lowStockThreshold: z.number().describe('The low stock threshold for this variant.'),
  averageDailySales: z.number().describe('The average daily sales for this variant over the past month.'),
  leadTimeDays: z.number().describe('The lead time in days to receive a new shipment of this product variant.'),
});
export type GetReorderSuggestionsInput = z.infer<typeof GetReorderSuggestionsInputSchema>;

const GetReorderSuggestionsOutputSchema = z.object({
  reorderQuantity: z.number().describe('The suggested reorder quantity to avoid stockouts and overstocking.'),
  reasoning: z.string().describe('The reasoning behind the suggested reorder quantity, considering sales data, lead time, and stock levels.'),
});
export type GetReorderSuggestionsOutput = z.infer<typeof GetReorderSuggestionsOutputSchema>;

export async function getReorderSuggestions(input: GetReorderSuggestionsInput): Promise<GetReorderSuggestionsOutput> {
  return getReorderSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getReorderSuggestionsPrompt',
  input: {schema: GetReorderSuggestionsInputSchema},
  output: {schema: GetReorderSuggestionsOutputSchema},
  prompt: `You are an inventory management expert, providing reorder suggestions for building materials.

  Based on the following information, suggest an optimal reorder quantity for the product variant.

  Product Name: {{{productName}}}
  Variant Details: {{{variantDetails}}}
  Current Quantity in Stock: {{{quantityInStock}}}
  Low Stock Threshold: {{{lowStockThreshold}}}
  Average Daily Sales (past month): {{{averageDailySales}}}
  Lead Time (days): {{{leadTimeDays}}}

  Consider the lead time, current stock level, low stock threshold, and average daily sales to determine the reorder quantity. Provide a clear reasoning for your suggestion.
  Do not suggest to order less than 1, unless the store is closing, and there is currently enough stock to last until the store closes. The store is not closing, so suggest at least 1.
  Reorder Quantity:`, // Ensure that output is provided
});

const getReorderSuggestionsFlow = ai.defineFlow(
  {
    name: 'getReorderSuggestionsFlow',
    inputSchema: GetReorderSuggestionsInputSchema,
    outputSchema: GetReorderSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
