"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, ArrowLeftRight, Target, Sparkles, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
];

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
         <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary">
            <defs>
              <linearGradient id="sidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--sidebar-primary))', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--sidebar-accent))', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="url(#sidebarGrad)" strokeWidth="8" fill="hsl(var(--sidebar-background))" />
            <path d="M30 60 Q50 30 70 60" stroke="hsl(var(--sidebar-foreground))" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <circle cx="50" cy="70" r="8" fill="hsl(var(--sidebar-accent))" />
          </svg>
          <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">ClarityBud</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {/* Optional Footer Example */}
      {/* 
      <SidebarFooter className="p-2 border-t border-sidebar-border mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" passHref legacyBehavior>
              <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Settings">
                <a><Settings /><span>Settings</span></a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      */}
    </>
  );
}
