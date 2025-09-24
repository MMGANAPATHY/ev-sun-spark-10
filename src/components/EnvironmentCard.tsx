import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnvironmentCardProps {
  temperature: number;
  humidity: number;
  className?: string;
}

export const EnvironmentCard = ({ 
  temperature, 
  humidity, 
  className 
}: EnvironmentCardProps) => {
  const getTemperatureColor = (temp: number) => {
    if (temp > 35) return "text-destructive";
    if (temp > 30) return "text-solar-orange";
    return "text-accent";
  };

  const getHumidityColor = (hum: number) => {
    if (hum > 70) return "text-primary";
    if (hum < 30) return "text-solar-orange";
    return "text-accent";
  };

  return (
    <Card className={cn(
      "bg-gradient-to-br from-card to-accent/5 border-accent/20",
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Thermometer className="h-5 w-5" />
          Environment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Thermometer className={cn("h-5 w-5", getTemperatureColor(temperature))} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className={cn("text-2xl font-bold", getTemperatureColor(temperature))}>
                {temperature.toFixed(1)}°C
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Droplets className={cn("h-5 w-5", getHumidityColor(humidity))} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className={cn("text-2xl font-bold", getHumidityColor(humidity))}>
                {humidity.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs text-accent">Live Data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};