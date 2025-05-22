"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Category, Transaction } from '@/types';
import { defaultCategories } from '@/types';
import { CategoryManager } from '@/components/budgets/category-manager';
import { BudgetProgressList } from '@/components/budgets/budget-progress-list';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock transactions data for budget calculation
const mockTransactions: Transaction[] = [
  { id: 't1', type: 'expense', categoryId: 'food', amount: 150, date: new Date(), description: 'Groceries' },
  { id: 't2', type: 'expense', categoryId: 'transport', amount: 50, date: new Date(), description: 'Gas' },
  { id: 't3', type: 'expense', categoryId: 'food', amount: 70, date: new Date(), description: 'Restaurant' },
  { id: 't4', type: 'expense', categoryId: 'utilities', amount: 100, date: new Date(), description: 'Electricity' },
];


export default function BudgetsPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions); // Using mock transactions for budget display
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load categories and transactions from storage or API in a real app
  }, []);

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    } else {
      setCategories(prev => [...prev, { ...category, id: category.name.toLowerCase().replace(/\s+/g, '-') + Date.now() }]);
    }
    setIsCategoryFormOpen(false);
    setEditingCategory(undefined);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Also consider deleting related transactions or re-categorizing them.
  };
  
  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded w-36 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Budgets</CardTitle>
            <CardDescription>Set and track your monthly spending goals for each category.</CardDescription>
          </div>
           <Dialog open={isCategoryFormOpen} onOpenChange={(isOpen) => {
              setIsCategoryFormOpen(isOpen);
              if (!isOpen) setEditingCategory(undefined);
            }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(undefined)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category/Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit' : 'Add New'} Category & Budget</DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Update the details for this category.' : 'Define a new spending category and set a budget for it.'}
                </DialogDescription>
              </DialogHeader>
              <CategoryManager 
                onSave={handleSaveCategory} 
                initialData={editingCategory}
                onCancel={() => {
                  setIsCategoryFormOpen(false);
                  setEditingCategory(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <BudgetProgressList 
            categories={categories} 
            transactions={transactions}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </CardContent>
      </Card>
    </div>
  );
}
