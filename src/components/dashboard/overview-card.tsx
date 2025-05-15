import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function OverviewCard({ title, value, icon: Icon, description, className }: OverviewCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
