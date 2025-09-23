# Data Simulator for Testing (runs on computer/server)
# Use this to simulate sensor data when ESP32 is not available

import requests
import json
import time
import random
import threading
from datetime import datetime

class SensorDataSimulator:
    def __init__(self, server_url="http://localhost:5000"):
        self.server_url = server_url
        self.stations = [
            {"id": "STATION_001", "name": "Downtown Station", "lat": 40.7128, "lng": -74.0060},
            {"id": "STATION_002", "name": "Mall Station", "lat": 40.7589, "lng": -73.9851},
            {"id": "STATION_003", "name": "Airport Station", "lat": 40.6413, "lng": -73.7781},
            {"id": "STATION_004", "name": "University Station", "lat": 40.8176, "lng": -73.7004},
        ]
        
    def generate_realistic_data(self, station_id):
        """Generate realistic sensor data"""
        # Time-based variations (simulate day/night cycles)
        hour = datetime.now().hour
        is_daytime = 6 <= hour <= 18
        
        # Solar power generation (higher during day)
        if is_daytime:
            base_voltage = random.uniform(23, 26)  # Higher voltage during day
            base_current = random.uniform(5, 15)   # Higher current during day
        else:
            base_voltage = random.uniform(20, 23)  # Lower voltage at night
            base_current = random.uniform(0, 3)    # Minimal current at night
        
        # Add some random variations
        voltage = base_voltage + random.uniform(-2, 2)
        current_dc = max(0, base_current + random.uniform(-2, 2))
        current_ac = random.uniform(0, 8)  # AC load current
        
        # Environmental data
        temperature = random.uniform(18, 35)  # 18-35°C
        humidity = random.uniform(30, 80)     # 30-80%
        
        # Calculate power
        power = voltage * current_dc
        
        # Charging status simulation
        is_charging = current_ac > 2
        battery_level = random.uniform(20, 100) if is_charging else random.uniform(50, 100)
        
        return {
            "station_id": station_id,
            "timestamp": datetime.now().isoformat(),
            "voltage": round(voltage, 2),
            "current_dc": round(current_dc, 2),
            "current_ac": round(current_ac, 2),
            "power": round(power, 2),
            "temperature": round(temperature, 1),
            "humidity": round(humidity, 1),
            "battery_level": round(battery_level, 1),
            "is_charging": is_charging,
            "energy_generated": round(power * 0.1, 2),  # kWh in last interval
            "efficiency": round(random.uniform(85, 95), 1)  # Solar panel efficiency
        }
    
    def send_data(self, data):
        """Send data to server"""
        try:
            response = requests.post(
                f"{self.server_url}/api/sensors/data",
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=5
            )
            
            if response.status_code == 200:
                print(f"✓ Data sent for {data['station_id']}")
                return True
            else:
                print(f"✗ Server error {response.status_code} for {data['station_id']}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Network error for {data['station_id']}: {e}")
            return False
    
    def simulate_station(self, station):
        """Simulate data for a single station"""
        while True:
            try:
                data = self.generate_realistic_data(station["id"])
                self.send_data(data)
                
                # Random interval between 5-15 seconds
                time.sleep(random.uniform(5, 15))
                
            except Exception as e:
                print(f"Error simulating {station['id']}: {e}")
                time.sleep(5)
    
    def start_simulation(self):
        """Start simulation for all stations"""
        print("Starting IoT Data Simulation...")
        print(f"Target server: {self.server_url}")
        print(f"Simulating {len(self.stations)} charging stations")
        print("-" * 50)
        
        # Create a thread for each station
        threads = []
        for station in self.stations:
            thread = threading.Thread(
                target=self.simulate_station, 
                args=(station,),
                daemon=True
            )
            thread.start()
            threads.append(thread)
            print(f"Started simulation for {station['name']}")
        
        try:
            # Keep main thread alive
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nSimulation stopped by user")

if __name__ == "__main__":
    # Configuration
    SERVER_URL = "https://your-app-domain.com"  # Replace with your app URL
    
    # Start simulator
    simulator = SensorDataSimulator(SERVER_URL)
    simulator.start_simulation()