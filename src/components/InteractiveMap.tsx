import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from "@/components/ui/card";

interface Station {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  availableChargers: number;
  totalChargers: number;
  fastCharging: boolean;
  solarPowered: boolean;
  pricePerKwh: number;
  iotData: any;
}

interface InteractiveMapProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ stations, onStationClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Leaflet map with OpenStreetMap tiles (free)
    map.current = L.map(mapContainer.current).setView([40.7128, -74.006], 12);

    // Add OpenStreetMap tile layer (free alternative to Mapbox)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add markers for each station
    stations.forEach((station) => {
      if (!map.current) return;
      
      const availability = station.availableChargers / station.totalChargers;
      const markerColor = availability > 0.6 ? '#22c55e' : availability > 0.3 ? '#f59e0b' : '#ef4444';

      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: ${markerColor};
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: bold;
          ">⚡</div>
        `,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Create marker
      const marker = L.marker([station.lat, station.lng], { icon: customIcon })
        .addTo(map.current);

      // Create popup content
      const popupContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${station.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${station.address}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; color: #374151;">Chargers:</span>
            <span style="font-weight: bold; color: ${markerColor};">${station.availableChargers}/${station.totalChargers}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; color: #374151;">Price:</span>
            <span style="font-weight: bold;">$${station.pricePerKwh}/kWh</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; color: #374151;">Distance:</span>
            <span style="font-weight: bold;">${station.distance} miles</span>
          </div>
          <div style="margin-top: 8px;">
            ${station.solarPowered ? '<span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-size: 12px;">☀️ Solar</span>' : ''}
            ${station.fastCharging ? '<span style="background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 4px;">⚡ Fast</span>' : ''}
          </div>
        </div>
      `;

      // Bind popup and click event
      marker.bindPopup(popupContent);
      marker.on('click', () => {
        onStationClick?.(station);
      });
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stations, onStationClick]);

  return (
    <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
      <div className="p-6">
        <div 
          ref={mapContainer} 
          className="h-64 w-full rounded-lg"
        />
      </div>
    </Card>
  );
};

export default InteractiveMap;