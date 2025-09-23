import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StationCard } from "./StationCard";
import { MetricsCard } from "./MetricsCard";
import { EnvironmentCard } from "./EnvironmentCard";

import { Zap, Sun, Battery, Thermometer, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Simulated IoT data - in real implementation, this would come from ESP32
const generateMockData = () => ({
  timestamp: new Date().toISOString(),
  solarPower: Math.random() * 5000 + 2000, // 2-7kW
  batteryLevel: Math.random() * 40 + 60, // 60-100%
  temperature: Math.random() * 10 + 25, // 25-35°C
  humidity: Math.random() * 20 + 40, // 40-60%
  totalCurrent: Math.random() * 50 + 10, // 10-60A
  voltage: Math.random() * 20 + 220, // 220-240V
  power: Math.random() * 10000 + 5000, // 5-15kW
});

const mockStations = [
  { id: 1, name: "Station Alpha", status: "charging" as const, progress: 75, timeRemaining: "45 min" },
  { id: 2, name: "Station Beta", status: "available" as const, progress: 0, timeRemaining: "0 min" },
  { id: 3, name: "Station Gamma", status: "charging" as const, progress: 32, timeRemaining: "2h 15min" },
  { id: 4, name: "Station Delta", status: "maintenance" as const, progress: 0, timeRemaining: "N/A" },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [iotData, setIotData] = useState(generateMockData());
  const [stations, setStations] = useState(mockStations);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIotData(generateMockData());
      
      // Update station progress
      setStations(prevStations =>
        prevStations.map(station => {
          if (station.status === "charging") {
            const newProgress = Math.min(station.progress + Math.random() * 2, 100);
            return {
              ...station,
              progress: newProgress,
              timeRemaining: newProgress >= 100 ? "Complete" : station.timeRemaining
            };
          }
          return station;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeStations = stations.filter(s => s.status === "charging").length;
  const totalCapacity = stations.length * 50; // 50kW per station
  const currentLoad = stations
    .filter(s => s.status === "charging")
    .reduce((sum, s) => sum + (s.progress * 0.5), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-electric bg-clip-text text-transparent">
              Solar EV Charging Hub
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring and management system
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/finder')}
              className="bg-gradient-eco hover:shadow-glow-eco"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Stations
            </Button>
            <Badge variant="outline" className="border-accent text-accent px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
                System Online
              </div>
            </Badge>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Solar Generation"
            value={`${(iotData.solarPower / 1000).toFixed(1)} kW`}
            icon={Sun}
            trend="+12%"
            className="border-solar-orange/20 bg-gradient-to-br from-card to-solar-orange/5"
          />
          
          <MetricsCard
            title="Active Stations"
            value={`${activeStations}/${stations.length}`}
            icon={Zap}
            trend={`${Math.round((activeStations / stations.length) * 100)}%`}
            className="border-primary/20 bg-gradient-to-br from-card to-primary/5"
          />
          
          <MetricsCard
            title="Battery Level"
            value={`${Math.round(iotData.batteryLevel)}%`}
            icon={Battery}
            trend="Optimal"
            className="border-accent/20 bg-gradient-to-br from-card to-accent/5"
          />
          
          <MetricsCard
            title="Temperature"
            value={`${iotData.temperature.toFixed(1)}°C`}
            icon={Thermometer}
            trend="Normal"
            className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5"
          />
        </div>

        {/* Environment and Power Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EnvironmentCard
            temperature={iotData.temperature}
            humidity={iotData.humidity}
            className="lg:col-span-1"
          />
          
          <Card className="lg:col-span-2 bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                Power Grid Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Voltage</p>
                  <p className="text-2xl font-bold">{iotData.voltage.toFixed(1)}V</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current</p>
                  <p className="text-2xl font-bold">{iotData.totalCurrent.toFixed(1)}A</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Load Capacity</span>
                  <span className="text-sm font-medium">
                    {currentLoad.toFixed(0)}kW / {totalCapacity}kW
                  </span>
                </div>
                <Progress 
                  value={(currentLoad / totalCapacity) * 100} 
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Charging Stations Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Charging Stations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stations.map((station) => (
              <StationCard key={station.id} {...station} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};