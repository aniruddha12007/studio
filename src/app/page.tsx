
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, ListChecks, PlusCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { defaultCategories, type Category, type Transaction } from '@/types';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart, Tooltip as RechartsTooltip } from 'recharts';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context'; // Reverted to alias
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', categoryId: 'salary', amount: 3000, date: new Date(2024, 5, 1), description: 'Monthly Salary' },
  { id: '2', type: 'expense', categoryId: 'food', amount: 250, date: new Date(2024, 5, 5), description: 'Groceries' },
  { id: '3', type: 'expense', categoryId: 'transport', amount: 80, date: new Date(2024, 5, 6), description: 'Gasoline' },
  { id: '4', type: 'expense', categoryId: 'utilities', amount: 120, date: new Date(2024, 5, 10), description: 'Electricity Bill' },
  { id: '5', type: 'expense', categoryId: 'entertainment', amount: 60, date: new Date(2024, 5, 15), description: 'Movie Tickets' },
  { id: '6', type: 'expense', categoryId: 'food', amount: 40, date: new Date(2024, 5, 18), description: 'Lunch Out' },
];

interface ChartData {
  name: string;
  total: number;
  fill?: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [mounted, setMounted] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
    if (mounted && user) {
      try {
        const storedTransactions = localStorage.getItem(`transactions_${user.uid}`);
        if (storedTransactions) {
          const parsedTransactions: Transaction[] = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
          if (Array.isArray(parsedTransactions)) {
            setTransactions(parsedTransactions);
          } else {
            console.error('Stored transactions are not an array, using initial transactions.');
            setTransactions(initialTransactions); // Fallback
          }
        } else {
           setTransactions(initialTransactions); 
        }

        const storedCategories = localStorage.getItem(`categories_${user.uid}`);
        if (storedCategories) {
          const parsedCategories: Category[] = JSON.parse(storedCategories);
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
        console.error('Failed to parse data from localStorage, using defaults:', error);
        setTransactions(initialTransactions);
        setCategories(defaultCategories);
      }
    }
  }, [mounted, user, loading, router]);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }, [transactions]);

  const spendingByCategoryChartData: ChartData[] = useMemo(() => {
    return categories
      .filter(cat => transactions.some(t => t.categoryId === cat.id && t.type === 'expense'))
      .map(cat => {
        const total = transactions
          .filter(t => t.categoryId === cat.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return { name: cat.name, total, fill: cat.color || 'hsl(var(--primary))' };
      })
      .filter(data => data.total > 0)
      .sort((a,b) => b.total - a.total)
      .slice(0, 5); // Top 5 categories
  }, [transactions, categories]);

  const budgetProgress = useMemo(() => {
    return categories
      .filter(cat => cat.budget > 0)
      .map(cat => {
        const spent = transactions
          .filter(t => t.categoryId === cat.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        const progress = cat.budget > 0 ? Math.min((spent / cat.budget) * 100, 100) : 0;
        return { ...cat, spent, progress, remaining: cat.budget - spent };
      })
      .sort((a,b) => b.progress - a.progress)
      .slice(0, 3); // Top 3 budgets
  }, [transactions, categories]);
  
  const chartConfig = useMemo(() => {
    const config: any = {};
    spendingByCategoryChartData.forEach(item => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });
    return config;
  }, [spendingByCategoryChartData]);


  if (loading || !mounted || !user) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-36">
              <CardHeader><Skeleton className="h-6 w-3/4 mb-2" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 h-80">
            <CardHeader><Skeleton className="h-6 w-1/4 mb-2" /></CardHeader>
            <CardContent className="flex justify-center items-center h-[calc(100%-4rem)]">
                <Skeleton className="w-full h-5/6" />
            </CardContent>
            </Card>
            <Card className="lg:col-span-3 h-80">
            <CardHeader><Skeleton className="h-6 w-1/4 mb-2" /></CardHeader>
            <CardContent className="space-y-4 pt-2 h-[calc(100%-4rem)]">
                {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                    <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full bg-muted-foreground/30" />
                </div>
                ))}
                <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-accent' : 'text-destructive'}`}>
              ${summary.netBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Budget Helper</CardTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
             <Link href="/ai-assistant" passHref>
                <Button className="w-full" size="sm">
                  Get Suggestions
                </Button>
              </Link>
            <p className="text-xs text-muted-foreground mt-2 text-center">Optimize your spending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>Top 5 spending categories this month.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {spendingByCategoryChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={spendingByCategoryChartData} layout="vertical" margin={{ right: 30, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} interval={0} />
                    <RechartsTooltip 
                      cursor={{ fill: "hsl(var(--muted))" }}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="total" radius={4}>
                      {/* {spendingByCategoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))} */}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Image src="https://placehold.co/300x200.png" alt="Empty chart placeholder" width={200} height={150} data-ai-hint="data chart" className="opacity-50 mb-4 rounded-md"/>
                <p className="text-muted-foreground">No spending data available for charts.</p>
                <p className="text-sm text-muted-foreground">Add some expenses to see your spending breakdown.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Top 3 budget categories.</CardDescription>
          </CardHeader>
          <CardContent>
            {budgetProgress.length > 0 ? (
              <div className="space-y-4">
                {budgetProgress.map(budget => (
                  <div key={budget.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{budget.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ${budget.spent.toFixed(2)} / ${budget.budget.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={budget.progress} aria-label={`${budget.name} budget progress`} 
                              className={budget.progress > 85 && budget.remaining >=0 ? "accent" : budget.remaining < 0 ? "destructive" : ""}
                    />
                     {budget.remaining < 0 && (
                      <p className="text-xs text-destructive mt-1">
                        Overspent by ${Math.abs(budget.remaining).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
                 <Link href="/budgets" passHref>
                    <Button variant="outline" className="w-full mt-4">
                      <ListChecks className="mr-2 h-4 w-4" /> Manage All Budgets
                    </Button>
                  </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Image src="https://placehold.co/300x200.png" alt="Empty budget placeholder" width={200} height={150} data-ai-hint="financial planning" className="opacity-50 mb-4 rounded-md"/>
                <p className="text-muted-foreground">No budget goals set yet.</p>
                <Link href="/budgets" passHref>
                  <Button variant="default" className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" /> Set Your First Budget
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
