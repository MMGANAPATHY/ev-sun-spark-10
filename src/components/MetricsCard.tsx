import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export const MetricsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className 
}: MetricsCardProps) => {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-105 hover:shadow-lg",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">
          {value}
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span className="text-accent font-medium">{trend}</span> from last hour
          </p>
        )}
      </CardContent>
    </Card>
  );
};