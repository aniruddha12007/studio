"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3 } from 'lucide-react';
import type { Transaction, Category } from '@/types';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEditTransaction?: (transaction: Transaction) => void; // Optional: for future edit functionality
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, categories, onEditTransaction, onDeleteTransaction }: TransactionListProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'N/A';
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Image src="https://placehold.co/300x200.png" alt="No transactions" width={200} height={133} data-ai-hint="empty list" className="opacity-60 mb-6 rounded-lg shadow-sm"/>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Yet</h3>
        <p className="text-muted-foreground">Start by adding your income and expenses.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} 
                       className={transaction.type === 'income' ? 'bg-accent text-accent-foreground' : ''}>
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
              <TableCell className={`font-medium ${transaction.type === 'income' ? 'text-accent-foreground' : 'text-destructive'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="max-w-[150px] truncate">{transaction.description || '-'}</TableCell>
              <TableCell className="text-right">
                {/* {onEditTransaction && (
                  <Button variant="ghost" size="icon" onClick={() => onEditTransaction(transaction)} className="mr-2">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )} */}
                <Button variant="ghost" size="icon" onClick={() => onDeleteTransaction(transaction.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
