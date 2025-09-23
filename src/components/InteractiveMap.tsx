import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Station {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  availableChargers: number;
  totalChargers: number;
  fastCharging: boolean;
  solarPowered: boolean;
  pricePerKwh: number;
}

interface InteractiveMapProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ stations, onStationClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.0060, 40.7128], // NYC default
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each station
    stations.forEach((station) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      // Color based on availability
      if (station.availableChargers === 0) {
        el.style.backgroundColor = '#ef4444'; // red
      } else if (station.availableChargers <= station.totalChargers * 0.25) {
        el.style.backgroundColor = '#f59e0b'; // yellow
      } else {
        el.style.backgroundColor = '#10b981'; // green
      }

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${station.name}</h3>
          <p class="text-sm text-gray-600">${station.address}</p>
          <p class="text-sm">
            ${station.availableChargers}/${station.totalChargers} chargers available
          </p>
          <p class="text-sm">$${station.pricePerKwh}/kWh</p>
          ${station.solarPowered ? '<span class="text-xs bg-yellow-100 px-1 rounded">☀️ Solar</span>' : ''}
          ${station.fastCharging ? '<span class="text-xs bg-blue-100 px-1 rounded">⚡ Fast</span>' : ''}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.lng, station.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event
      el.addEventListener('click', () => {
        if (onStationClick) {
          onStationClick(station);
        }
      });
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap(mapboxToken);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
        <div className="p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-lg font-semibold">Setup Interactive Map</h3>
              <p className="text-sm text-muted-foreground">
                Enter your Mapbox public token to enable the interactive map.
                Get yours at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="pk.ey..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTokenSubmit}>
                  Load Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
      <div className="p-6">
        <div ref={mapContainer} className="h-64 rounded-lg" />
      </div>
    </Card>
  );
};

export default InteractiveMap;