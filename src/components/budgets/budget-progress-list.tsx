"use client";

import React from 'react';
import type { Category, Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';

interface BudgetProgressListProps {
  categories: Category[];
  transactions: Transaction[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export function BudgetProgressList({ categories, transactions, onEditCategory, onDeleteCategory }: BudgetProgressListProps) {

  const categoriesWithProgress = categories.map(category => {
    const spent = transactions
      .filter(t => t.categoryId === category.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const progress = category.budget > 0 ? Math.min((spent / category.budget) * 100, 100) : 0;
    const remaining = category.budget - spent;
    const IconComponent = typeof category.icon === 'string' 
      ? (LucideIcons as any)[category.icon] || LucideIcons.Shapes 
      : category.icon;

    return { ...category, spent, progress, remaining, IconComponent };
  }).sort((a, b) => (b.budget > 0 ? 1 : 0) - (a.budget > 0 ? 1 : 0) || a.name.localeCompare(b.name)); // Show budgeted first

  if (categoriesWithProgress.filter(c => c.budget > 0).length === 0) {
     return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Image src="https://placehold.co/300x200.png" alt="No budgets set" width={200} height={133} data-ai-hint="piggy bank chart" className="opacity-60 mb-6 rounded-lg shadow-sm"/>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Budgets Set</h3>
        <p className="text-muted-foreground">Create budgets for your categories to track spending.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categoriesWithProgress.map(cat => (
        cat.budget > 0 && ( // Only display categories with a set budget
          <Card key={cat.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center pb-2">
              <cat.IconComponent className="h-6 w-6 mr-3 text-primary" />
              <div className="flex-1">
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                <CardDescription>Budget: ${cat.budget.toFixed(2)}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Spent: ${cat.spent.toFixed(2)}</span>
                  <span className={cat.remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}>
                    {cat.remaining >= 0 ? `Remaining: $${cat.remaining.toFixed(2)}` : `Overspent: $${Math.abs(cat.remaining).toFixed(2)}`}
                  </span>
                </div>
                <Progress value={cat.progress} className={cat.progress > 85 && cat.remaining >= 0 ? "accent" : cat.remaining < 0 ? "destructive" : ""} />
                {cat.progress > 85 && cat.remaining >=0 && cat.progress < 100 && (
                    <div className="flex items-center text-xs text-primary mt-1"> {/* Changed text-orange-500 to text-primary */}
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Nearing budget limit.
                    </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => onEditCategory(cat)} className="mr-2">
                <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteCategory(cat.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
              </Button>
            </CardFooter>
          </Card>
        )
      ))}
    </div>
  );
}
