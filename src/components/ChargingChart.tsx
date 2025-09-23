import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

const generateChartData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours().toString().padStart(2, '0') + ':00',
      solarPower: Math.random() * 3000 + 1000 + (Math.sin((time.getHours() - 6) * Math.PI / 12) * 2000),
      consumption: Math.random() * 2000 + 500,
      batteryLevel: Math.random() * 20 + 70,
    });
  }
  
  return data;
};

export const ChargingChart = () => {
  const [data, setData] = useState(generateChartData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateChartData());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          Power Analytics (INA219 + ACS712)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--solar-orange))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--solar-orange))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--electric-blue))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--electric-blue))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area
                type="monotone"
                dataKey="solarPower"
                stackId="1"
                stroke="hsl(var(--solar-orange))"
                fill="url(#solarGradient)"
                strokeWidth={2}
                name="Solar Power (W)"
              />
              <Area
                type="monotone"
                dataKey="consumption"
                stackId="2"
                stroke="hsl(var(--electric-blue))"
                fill="url(#consumptionGradient)"
                strokeWidth={2}
                name="Consumption (W)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-solar-orange rounded-full"></div>
            <span className="text-muted-foreground">Solar Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-electric-blue rounded-full"></div>
            <span className="text-muted-foreground">Station Consumption</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};