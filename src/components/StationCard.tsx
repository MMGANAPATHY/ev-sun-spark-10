import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StationCardProps {
  id: number;
  name: string;
  status: "charging" | "available" | "maintenance";
  progress: number;
  timeRemaining: string;
}

const statusConfig = {
  charging: {
    label: "Charging",
    color: "bg-primary text-primary-foreground",
    icon: Zap,
    borderColor: "border-primary/30",
    bgGradient: "bg-gradient-to-br from-card to-primary/10"
  },
  available: {
    label: "Available",
    color: "bg-accent text-accent-foreground",
    icon: Zap,
    borderColor: "border-accent/30",
    bgGradient: "bg-gradient-to-br from-card to-accent/10"
  },
  maintenance: {
    label: "Maintenance",
    color: "bg-destructive text-destructive-foreground",
    icon: AlertTriangle,
    borderColor: "border-destructive/30",
    bgGradient: "bg-gradient-to-br from-card to-destructive/10"
  }
};

export const StationCard = ({ id, name, status, progress, timeRemaining }: StationCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn(
      "transition-all duration-300 hover:scale-105",
      config.borderColor,
      config.bgGradient
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge className={config.color} variant="secondary">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {status === "charging" && (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Charging Progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Time remaining:</span>
              <span className="font-medium">{timeRemaining}</span>
            </div>
          </>
        )}
        
        {status === "available" && (
          <div className="text-center py-4">
            <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
            <p className="text-sm text-muted-foreground">Ready for next vehicle</p>
          </div>
        )}
        
        {status === "maintenance" && (
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm text-muted-foreground">Service required</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Station ID:</span>
              <span className="ml-1 font-mono">#{id.toString().padStart(3, '0')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-1">DC Fast</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};