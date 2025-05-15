
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
  LogIn,
  LogOut,
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
  // SidebarMenuBadge, // Not used currently
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

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
  const { user, loading, signInWithGoogle, signOut } = useAuth(); // Use the auth hook

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    // For hash links, check if the current path is the root and the hash matches
    if (href.startsWith("#")) return pathname === "/" && window.location.hash === href;
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
          <SidebarMenuItem>
            {loading ? (
              // Loading Skeleton
              <div className={cn(
                "flex items-center p-2 rounded-md", 
                state === "collapsed" ? "justify-center" : "justify-start"
              )}>
                <Skeleton className="h-8 w-8 rounded-full" />
                {state === "expanded" && (
                  <div className="ml-3 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                )}
              </div>
            ) : user ? (
              // User Logged In
              <div className={cn(
                "flex items-center p-2 rounded-md", 
                state === "collapsed" ? "justify-center" : "justify-start"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User Avatar"} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">{user.email || ""}</p>
                  </div>
                )}
              </div>
            ) : (
              // User Logged Out / No User
              state === "expanded" ? (
                 <Button onClick={signInWithGoogle} variant="outline" className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90">
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </Button>
              ) : (
                <SidebarMenuButton
                  onClick={signInWithGoogle}
                  tooltip={{ children: "Sign in with Google" }}
                >
                  <LogIn />
                </SidebarMenuButton>
              )
            )}
          </SidebarMenuItem>
          {user && state === "expanded" && (
            <SidebarMenuItem>
              <Button onClick={signOut} variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </SidebarMenuItem>
          )}
           {user && state === "collapsed" && (
             <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={signOut}
                    tooltip={{ children: "Sign out" }}
                >
                    <LogOut />
                </SidebarMenuButton>
             </SidebarMenuItem>
           )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
