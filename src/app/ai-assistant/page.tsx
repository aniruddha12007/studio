"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, Info } from 'lucide-react';
import { suggestBudgetAdjustments, type SuggestBudgetAdjustmentsInput, type SuggestBudgetAdjustmentsOutput } from '@/ai/flows/suggest-budget-adjustments';
import type { Transaction, Category, BudgetAdjustmentSuggestion } from '@/types';
import { defaultCategories } from '@/types'; // For default categories and structure
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data - in a real app, this would come from user's actual data
const mockIncome = 5000;
const mockTransactions: Transaction[] = [
  { id: 't1', type: 'expense', categoryId: 'food', amount: 450, date: new Date(), description: 'Groceries & Restaurants' },
  { id: 't2', type: 'expense', categoryId: 'transport', amount: 120, date: new Date(), description: 'Fuel & Public Transport' },
  { id: 't3', type: 'expense', categoryId: 'utilities', amount: 180, date: new Date(), description: 'Bills' },
  { id: 't4', type: 'expense', categoryId: 'entertainment', amount: 150, date: new Date(), description: 'Movies & Outings' },
  { id: 't5', type: 'expense', categoryId: 'shopping', amount: 250, date: new Date(), description: 'Clothes & Gadgets' },
];

export default function AIAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestBudgetAdjustmentsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(defaultCategories); // Using default categories with budgets
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const expensesInput = categories
      .map(cat => {
        const spentAmount = mockTransactions
          .filter(t => t.categoryId === cat.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        // Only include categories if they have a budget or if there was spending
        if (cat.budget > 0 || spentAmount > 0) {
          return {
            category: cat.name,
            amount: spentAmount,
            budget: cat.budget,
          };
        }
        return null;
      })
      .filter(Boolean) as SuggestBudgetAdjustmentsInput['expenses'];


    const input: SuggestBudgetAdjustmentsInput = {
      income: mockIncome,
      expenses: expensesInput,
    };

    try {
      const result = await suggestBudgetAdjustments(input);
      setSuggestions(result);
    } catch (e) {
      console.error("AI Assistant Error:", e);
      setError("Failed to get budget suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!mounted) {
     return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Budget Assistant
          </CardTitle>
          <CardDescription>
            Get personalized, conservative suggestions from our AI to help optimize your budget based on your spending patterns.
            This tool uses mocked income, expense, and budget data for demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleGetSuggestions} disabled={isLoading} size="lg">
            {isLoading ? 'Analyzing...' : 'Get AI Suggestions'}
          </Button>

          {error && (
            <Alert variant="destructive" className="mt-6 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
          <CardHeader><CardTitle>Analyzing Your Finances...</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-sm animate-pulse">
                <Skeleton className="h-5 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Budget Suggestions</CardTitle>
            <CardDescription>Here are some conservative recommendations to fine-tune your budget:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className="shadow-sm">
                 <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">{suggestion.category}</AlertTitle>
                <AlertDescription>
                  <p className="mb-1">
                    Suggested Adjustment: 
                    <span className={`font-medium ${suggestion.suggestedAdjustment > 0 ? 'text-green-600' : suggestion.suggestedAdjustment < 0 ? 'text-red-600' : ''}`}>
                      {suggestion.suggestedAdjustment > 0 ? '+' : ''}${suggestion.suggestedAdjustment.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.length === 0 && !isLoading && (
         <Card>
          <CardHeader>
            <CardTitle>No Specific Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-10">
             <Image src="https://placehold.co/200x150.png" alt="No suggestions" width={150} height={112} data-ai-hint="analysis complete" className="mx-auto opacity-70 mb-4 rounded-md"/>
            <p className="text-muted-foreground">The AI didn't find any specific adjustments to recommend at this time. Your budget might be well-optimized or more data could be needed!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
