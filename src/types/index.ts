import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon | string; // Allow string for custom SVG paths or simplified icon names initially
  budget: number;
  color?: string; // Optional color for charts, can be derived from theme
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface BudgetAdjustmentSuggestion {
  category: string;
  suggestedAdjustment: number;
  explanation: string;
}

export const defaultCategories: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'Landmark', budget: 0, color: 'hsl(var(--chart-1))' },
  { id: 'food', name: 'Food', icon: 'Utensils', budget: 300, color: 'hsl(var(--chart-2))' },
  { id: 'transport', name: 'Transport', icon: 'Car', budget: 100, color: 'hsl(var(--chart-3))' },
  { id: 'utilities', name: 'Utilities', icon: 'Lightbulb', budget: 150, color: 'hsl(var(--chart-4))' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', budget: 80, color: 'hsl(var(--chart-5))' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingCart', budget: 120, color: 'hsl(var(--chart-1))' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Stethoscope', budget: 50, color: 'hsl(var(--chart-2))' },
  { id: 'bills', name: 'Bills', icon: 'Receipt', budget: 200, color: 'hsl(var(--chart-3))' },
  { id: 'gifts', name: 'Gifts', icon: 'Gift', budget: 30, color: 'hsl(var(--chart-4))' },
  { id: 'travel', name: 'Travel', icon: 'Plane', budget: 0, color: 'hsl(var(--chart-5))' }, // Initially 0, user sets as needed
];
