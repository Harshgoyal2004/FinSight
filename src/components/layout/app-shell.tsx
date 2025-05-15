import type { ReactNode } from 'react';
import { SidebarNav } from './sidebar-nav';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, UserCircle } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  pageTitle: string;
}

export function AppShell({ children, pageTitle }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full">
      <SidebarNav />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="flex-1 text-xl font-semibold text-foreground">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="User Profile">
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
