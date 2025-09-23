import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Zap, Clock, Battery, Route } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Dummy charging station locations
const dummyStations = [
  {
    id: 1,
    name: "Solar Hub Central",
    address: "123 Green Energy Blvd, Tech City",
    lat: 40.7128,
    lng: -74.0060,
    distance: 0.8,
    availableChargers: 3,
    totalChargers: 4,
    fastCharging: true,
    solarPowered: true,
    pricePerKwh: 0.15,
    operatingHours: "24/7"
  },
  {
    id: 2,
    name: "EcoCharge Plaza",
    address: "456 Renewable Ave, Green District",
    lat: 40.7589,
    lng: -73.9851,
    distance: 2.3,
    availableChargers: 2,
    totalChargers: 6,
    fastCharging: true,
    solarPowered: true,
    pricePerKwh: 0.12,
    operatingHours: "6:00 AM - 10:00 PM"
  },
  {
    id: 3,
    name: "PowerPoint Station",
    address: "789 Electric Street, Innovation Park",
    lat: 40.7505,
    lng: -73.9934,
    distance: 1.5,
    availableChargers: 1,
    totalChargers: 3,
    fastCharging: false,
    solarPowered: false,
    pricePerKwh: 0.18,
    operatingHours: "24/7"
  },
  {
    id: 4,
    name: "SunVolt Express",
    address: "321 Solar Way, Energy Heights",
    lat: 40.7282,
    lng: -74.0776,
    distance: 3.2,
    availableChargers: 4,
    totalChargers: 8,
    fastCharging: true,
    solarPowered: true,
    pricePerKwh: 0.14,
    operatingHours: "24/7"
  },
  {
    id: 5,
    name: "GreenCharge Station",
    address: "654 Sustainable Dr, Eco Valley",
    lat: 40.6892,
    lng: -74.0445,
    distance: 4.1,
    availableChargers: 0,
    totalChargers: 4,
    fastCharging: true,
    solarPowered: true,
    pricePerKwh: 0.16,
    operatingHours: "5:00 AM - 11:00 PM"
  }
];

export const StationFinder = () => {
  const [userLocation, setUserLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "availability" | "price">("distance");
  const [stations, setStations] = useState(dummyStations);

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
          toast({
            title: "Location Found",
            description: "Showing nearest charging stations based on your location.",
          });
        },
        (error) => {
          setIsLocating(false);
          setUserLocation("New York, NY"); // Fallback location
          toast({
            title: "Location Access Denied",
            description: "Using default location. Please enable location services for accurate results.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocating(false);
      setUserLocation("New York, NY");
      toast({
        title: "Geolocation Not Supported",
        description: "Using default location.",
        variant: "destructive",
      });
    }
  };

  // Sort stations based on selected criteria
  const sortedStations = [...stations].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance;
      case "availability":
        return b.availableChargers - a.availableChargers;
      case "price":
        return a.pricePerKwh - b.pricePerKwh;
      default:
        return 0;
    }
  });

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return { status: "Full", color: "bg-destructive", textColor: "text-destructive-foreground" };
    if (percentage <= 25) return { status: "Limited", color: "bg-secondary", textColor: "text-secondary-foreground" };
    return { status: "Available", color: "bg-accent", textColor: "text-accent-foreground" };
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-electric bg-clip-text text-transparent">
            Find Nearest Charging Station
          </h1>
          <p className="text-muted-foreground">
            Locate solar-powered EV charging stations near you
          </p>
        </div>

        {/* Location Input */}
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              Your Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your address or location"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={getCurrentLocation}
                disabled={isLocating}
                variant="outline"
                size="icon"
              >
                <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {/* Sort Options */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
              {(["distance", "availability", "price"] as const).map((option) => (
                <Button
                  key={option}
                  variant={sortBy === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option)}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20"></div>
              <div className="text-center z-10">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-accent" />
                <p className="text-muted-foreground mb-2">Interactive Map Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  🗺️ Mapbox integration ready for deployment
                </p>
              </div>
              {/* Dummy map pins */}
              <div className="absolute top-4 left-8 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 right-12 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-6 w-4 h-4 bg-secondary rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Station List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Nearby Stations ({sortedStations.length})
          </h2>
          
          {sortedStations.map((station) => {
            const availability = getAvailabilityStatus(station.availableChargers, station.totalChargers);
            
            return (
              <Card key={station.id} className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-border/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{station.name}</h3>
                        {station.solarPowered && (
                          <Badge variant="outline" className="border-solar-orange text-solar-orange">
                            ☀️ Solar
                          </Badge>
                        )}
                        {station.fastCharging && (
                          <Badge variant="outline" className="border-primary text-primary">
                            ⚡ Fast
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-1">{station.address}</p>
                      <p className="text-sm text-muted-foreground">{station.operatingHours}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {station.distance} km
                      </div>
                      <Badge className={`${availability.color} ${availability.textColor}`}>
                        {availability.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {station.availableChargers}/{station.totalChargers} Available
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">${station.pricePerKwh}/kWh</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        ~{Math.round(station.distance * 2)} min drive
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Navigate</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      disabled={station.availableChargers === 0}
                      onClick={() => toast({
                        title: "Navigation Started",
                        description: `Navigating to ${station.name}`,
                      })}
                    >
                      <Route className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                    
                    <Button 
                      variant="outline"
                      disabled={station.availableChargers === 0}
                      onClick={() => toast({
                        title: "Reservation Requested",
                        description: `Attempting to reserve charger at ${station.name}`,
                      })}
                    >
                      Reserve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};