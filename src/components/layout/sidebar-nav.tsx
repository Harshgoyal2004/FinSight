"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Briefcase,
  Sparkles,
  Settings,
  CreditCard,
  Wallet,
  Landmark,
} from "lucide-react";
import { FinSightLogo } from "@/components/icons/logo";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "#expenses", label: "Expenses", icon: CreditCard },
  { href: "#budgets", label: "Budgets", icon: Target },
  { href: "#investments", label: "Investments", icon: Briefcase },
  { href: "#insights", label: "AI Insights", icon: Sparkles },
];

const secondaryNavItems = [
  { href: "#settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.includes(href) && href !== "/"; // For hash links on the same page
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 items-center">
        <FinSightLogo className={cn(state === "collapsed" ? "size-8" : "size-10")} />
        {state === "expanded" && (
          <h1 className="text-2xl font-semibold text-sidebar-foreground ml-2">FinSight</h1>
        )}
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label }}
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
      <SidebarFooter className="p-2">
        <SidebarMenu>
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
             <div className={cn(
                "flex items-center p-2 rounded-md", 
                state === "collapsed" ? "justify-center" : "justify-start"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>FS</AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-sidebar-foreground">User Name</p>
                    <p className="text-xs text-sidebar-foreground/70">user@finsight.com</p>
                  </div>
                )}
              </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
