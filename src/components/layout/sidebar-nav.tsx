
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Target,
  Briefcase,
  Sparkles,
  Settings,
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
  useSidebar,
} from "@/components/ui/sidebar";
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
    // For hash links, check if the current path is the root and the hash matches
    if (href.startsWith("#")) return pathname === "/" && typeof window !== 'undefined' && window.location.hash === href;
    return pathname.includes(href) && href !== "/";
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
          {/* User/Auth section removed */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
