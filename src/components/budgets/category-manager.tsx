"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@/types';
import { defaultCategories } from '@/types'; // For icon choices
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as LucideIcons from 'lucide-react'; // Import all icons

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
  budget: z.coerce.number().min(0, { message: 'Budget must be non-negative' }),
  icon: z.string().min(1, { message: 'Icon is required' }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryManagerProps {
  onSave: (category: Category) => void;
  onCancel?: () => void;
  initialData?: Category;
}

// Get a list of Lucide icon names, filtering out non-component exports
const lucideIconNames = Object.keys(LucideIcons).filter(
  (key) => typeof (LucideIcons as any)[key] === 'function' && /^[A-Z]/.test(key) && key !== 'createLucideIcon' && key !== 'Icon'
);


export function CategoryManager({ onSave, onCancel, initialData }: CategoryManagerProps) {
  const { control, handleSubmit, register, formState: { errors }, reset, setValue } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      budget: initialData?.budget || 0,
      icon: typeof initialData?.icon === 'string' ? initialData.icon : 'Shapes', // Default icon
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('budget', initialData.budget);
      setValue('icon', typeof initialData.icon === 'string' ? initialData.icon : 'Shapes');
    }
  }, [initialData, setValue]);

  const processSubmit = (data: CategoryFormData) => {
    const iconComponent = (LucideIcons as any)[data.icon] || LucideIcons.Shapes;
    onSave({
      id: initialData?.id || '', // ID will be set by parent if new
      ...data,
      icon: iconComponent, // Store the component for rendering
    });
    reset();
  };
  
  const { watch } = useForm(); // To watch icon changes
  // Dynamically get icon component for preview
  const SelectedIcon = (LucideIcons as any)[watch('icon') || 'Shapes'] || LucideIcons.Shapes;

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="budget">Monthly Budget</Label>
        <Input id="budget" type="number" step="0.01" {...register('budget')} />
        {errors.budget && <p className="text-sm text-destructive mt-1">{errors.budget.message}</p>}
      </div>

      <div>
        <Label htmlFor="icon">Icon</Label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="icon" className="flex-grow">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {lucideIconNames.map(iconName => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        {React.createElement((LucideIcons as any)[iconName] || LucideIcons.HelpCircle, { className: "h-4 w-4" })}
                        {iconName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && React.createElement((LucideIcons as any)[field.value] || LucideIcons.Shapes, {className: "h-6 w-6 text-primary"})}
            </div>
          )}
        />
        {errors.icon && <p className="text-sm text-destructive mt-1">{errors.icon.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit">{initialData ? 'Save Changes' : 'Add Category'}</Button>
      </div>
    </form>
  );
}
