"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react'; // Using UserCircle as a placeholder
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <Link href="/" className="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity:1}} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" stroke="url(#grad1)" strokeWidth="8" fill="hsl(var(--background))" />
          <path d="M30 60 Q50 30 70 60" stroke="hsl(var(--foreground))" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <circle cx="50" cy="70" r="8" fill="hsl(var(--accent))" />
        </svg>
        <span className="text-xl font-semibold">ClarityBud</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {/* Placeholder for future auth/user features */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">User Profile</span>
        </Button>
      </div>
    </header>
  );
}
