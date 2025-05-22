"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { TransactionList } from '@/components/transactions/transaction-list';
import type { Transaction, Category } from '@/types';
import { defaultCategories } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', categoryId: 'salary', amount: 3000, date: new Date(2024, 5, 1), description: 'Monthly Salary' },
  { id: '2', type: 'expense', categoryId: 'food', amount: 250, date: new Date(2024, 5, 5), description: 'Groceries' },
];


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load transactions and categories from storage or API in a real app
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
    setIsFormOpen(false); // Close dialog after submission
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  if (!mounted) {
     return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-6 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </div>
            <div className="h-10 w-36 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded"></div>
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
            <CardTitle>Transactions</CardTitle>
            <CardDescription>View and manage your income and expenses.</CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Enter the details of your income or expense.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm
                categories={categories}
                onSubmit={addTransaction}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <TransactionList 
            transactions={transactions} 
            categories={categories}
            onDeleteTransaction={deleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
}
