
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
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push('/login');
    }
    if (mounted && user) {
      try {
        const storedCategories = localStorage.getItem(`categories_${user.uid}`);
        if (storedCategories) {
          const parsedCategories: Category[] = JSON.parse(storedCategories);
          // Basic validation
          if (Array.isArray(parsedCategories) && parsedCategories.every(cat => cat.id && cat.name && typeof cat.budget === 'number')) {
            setCategories(parsedCategories);
          } else {
             setCategories(defaultCategories);
             localStorage.setItem(`categories_${user.uid}`, JSON.stringify(defaultCategories));
          }
        } else {
            setCategories(defaultCategories);
            localStorage.setItem(`categories_${user.uid}`, JSON.stringify(defaultCategories));
        }
      } catch (error) {
        console.error("Failed to load categories from localStorage", error);
        setCategories(defaultCategories); // Fallback to default
      }
       // Load transactions (if they were dynamic and user-specific)
       const storedTransactions = localStorage.getItem(`transactions_${user.uid}`);
       if (storedTransactions) {
         try {
           const parsedTransactions: Transaction[] = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
           setTransactions(parsedTransactions);
         } catch (e) {
           console.error("Failed to parse transactions from LS for budgets page", e);
           setTransactions(mockTransactions); // fallback to mock
         }
       } else {
         setTransactions(mockTransactions); // fallback to mock if nothing in LS
       }
    }
  }, [mounted, user, loading, router]);

  const handleSaveCategory = (category: Category) => {
    let updatedCategories;
    if (editingCategory) {
      updatedCategories = categories.map(c => c.id === category.id ? category : c);
    } else {
      updatedCategories = [...categories, { ...category, id: category.name.toLowerCase().replace(/\s+/g, '-') + Date.now() }];
    }
    setCategories(updatedCategories);
    if (user) {
      localStorage.setItem(`categories_${user.uid}`, JSON.stringify(updatedCategories));
    }
    setIsCategoryFormOpen(false);
    setEditingCategory(undefined);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(c => c.id !== id);
    setCategories(updatedCategories);
    if (user) {
      localStorage.setItem(`categories_${user.uid}`, JSON.stringify(updatedCategories));
    }
    // Also consider deleting related transactions or re-categorizing them.
  };
  
  if (loading || !mounted || !user) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-40" />
          </CardHeader>
          <CardContent>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center pb-2">
                            <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-4 w-full bg-muted-foreground/30" />
                        </CardContent>
                        <CardFooter className="border-t pt-4 space-x-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-20" />
                        </CardFooter>
                    </Card>
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

