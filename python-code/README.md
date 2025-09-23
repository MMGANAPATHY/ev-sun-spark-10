# IoT Solar EV Charging Station - Python Code

This directory contains the Python code for the ESP32 sensor integration and data simulation for your solar-powered EV charging station management system.

## Files Overview

### 1. `esp32_sensor_integration.py`
Main ESP32 code that:
- Reads data from INA219 (voltage/current sensor)
- Reads data from DHT22 (temperature/humidity sensor)  
- Reads data from ACS712 (AC current sensor)
- Sends data to your web application via HTTP API
- Handles Wi-Fi connectivity

### 2. `data_simulator.py`
Python simulator that:
- Generates realistic sensor data for testing
- Simulates multiple charging stations
- Sends data to your web app for demonstration
- Perfect for hackathon demos when hardware isn't available

### 3. `requirements.txt`
Python dependencies needed for the simulator and additional features

## Hardware Setup

### ESP32 Connections:
```
ESP32 Pin  |  Component      |  Connection
-----------|-----------------|------------------
GPIO 4     |  DHT22         |  Data pin
GPIO 21    |  INA219        |  SDA (I2C)
GPIO 22    |  INA219        |  SCL (I2C)
GPIO 34    |  ACS712        |  Analog Output
VCC        |  All Sensors   |  3.3V/5V
GND        |  All Sensors   |  Ground
```

### Sensor Functions:
- **INA219**: Measures DC voltage and current from solar panels
- **DHT22**: Monitors temperature and humidity for optimal charging
- **ACS712**: Measures AC current consumption during EV charging

## Installation & Usage

### For ESP32:
1. Install MicroPython on your ESP32
2. Upload `esp32_sensor_integration.py` to the ESP32
3. Update Wi-Fi credentials and server URL in the code
4. Connect sensors according to the pin diagram
5. Run the code on ESP32

### For Simulation (Testing):
1. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```

2. Update server URL in `data_simulator.py`:
   ```python
   SERVER_URL = "https://your-app-domain.com"
   ```

3. Run the simulator:
   ```bash
   python data_simulator.py
   ```

## API Integration

The ESP32 sends data to your web application using this JSON format:
```json
{
  "station_id": "STATION_001",
  "timestamp": "2024-01-15T10:30:00Z",
  "voltage": 24.5,
  "current_dc": 8.2,
  "current_ac": 5.1,
  "power": 200.9,
  "temperature": 25.3,
  "humidity": 62.1,
  "battery_level": 85.5,
  "is_charging": true
}
```

## For Hackathon Demo

1. **Use the simulator** for initial demo without hardware
2. **Show real-time data** flowing into your web dashboard
3. **Demonstrate multiple stations** with varying data patterns
4. **Highlight the complete IoT pipeline** from sensors to web UI

## Troubleshooting

### ESP32 Issues:
- Check Wi-Fi credentials
- Verify sensor connections
- Monitor serial output for errors
- Ensure stable power supply

### Simulator Issues:
- Check server URL and network connectivity
- Verify API endpoints are accessible
- Monitor console output for HTTP errors

## Next Steps

- Add GPS module for real location tracking
- Implement MQTT for more efficient communication
- Add local data logging with SD card
- Integrate with battery management system
- Add security features (HTTPS, authentication)