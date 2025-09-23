# ESP32 Sensor Integration for Solar EV Charging Station
# Required libraries: micropython, adafruit-circuitpython-ina219, adafruit-circuitpython-dht
# Hardware: ESP32, INA219 (Current/Voltage), DHT22 (Temperature/Humidity), ACS712 (AC Current)

import machine
import network
import urequests
import ujson
import time
from machine import Pin, ADC, I2C
import dht

# Wi-Fi Configuration
WIFI_SSID = "your_wifi_ssid"
WIFI_PASSWORD = "your_wifi_password"

# Server Configuration (your web app endpoint)
SERVER_URL = "https://your-app-domain.com/api"

# Pin Configuration
DHT22_PIN = 4        # DHT22 data pin
ACS712_PIN = 34      # ACS712 analog output pin
SDA_PIN = 21         # I2C SDA for INA219
SCL_PIN = 22         # I2C SCL for INA219

class SensorManager:
    def __init__(self):
        # Initialize DHT22
        self.dht_sensor = dht.DHT22(Pin(DHT22_PIN))
        
        # Initialize ACS712 ADC
        self.acs712_adc = ADC(Pin(ACS712_PIN))
        self.acs712_adc.atten(ADC.ATTN_11DB)  # 0-3.3V range
        
        # Initialize I2C for INA219
        self.i2c = I2C(0, sda=Pin(SDA_PIN), scl=Pin(SCL_PIN), freq=400000)
        self.ina219_addr = 0x40  # Default INA219 address
        
        # Initialize INA219
        self.init_ina219()
        
    def init_ina219(self):
        """Initialize INA219 current/voltage sensor"""
        try:
            # Configure INA219 for 32V, 2A range
            config = 0x399F  # 32V range, 320mV shunt range, 12-bit, 1 sample
            self.i2c.writeto_mem(self.ina219_addr, 0x00, config.to_bytes(2, 'big'))
            print("INA219 initialized successfully")
        except Exception as e:
            print(f"INA219 initialization failed: {e}")
    
    def read_dht22(self):
        """Read temperature and humidity from DHT22"""
        try:
            self.dht_sensor.measure()
            temperature = self.dht_sensor.temperature()
            humidity = self.dht_sensor.humidity()
            return temperature, humidity
        except Exception as e:
            print(f"DHT22 read error: {e}")
            return None, None
    
    def read_ina219_voltage(self):
        """Read bus voltage from INA219"""
        try:
            # Read bus voltage register (0x02)
            raw_voltage = self.i2c.readfrom_mem(self.ina219_addr, 0x02, 2)
            voltage_raw = int.from_bytes(raw_voltage, 'big')
            # Convert to voltage (LSB = 4mV, shift right by 3)
            voltage = (voltage_raw >> 3) * 0.004
            return voltage
        except Exception as e:
            print(f"INA219 voltage read error: {e}")
            return None
    
    def read_ina219_current(self):
        """Read current from INA219"""
        try:
            # Read current register (0x04)
            raw_current = self.i2c.readfrom_mem(self.ina219_addr, 0x04, 2)
            current_raw = int.from_bytes(raw_current, 'big')
            # Convert to current (LSB = 0.1mA for 0.1 ohm shunt)
            if current_raw > 32767:
                current_raw -= 65536  # Handle negative values
            current = current_raw * 0.0001  # 0.1mA LSB
            return current
        except Exception as e:
            print(f"INA219 current read error: {e}")
            return None
    
    def read_acs712(self):
        """Read AC current from ACS712"""
        try:
            # Read multiple samples for accuracy
            samples = []
            for _ in range(100):
                sample = self.acs712_adc.read()
                samples.append(sample)
                time.sleep_ms(1)
            
            # Calculate RMS value
            avg_sample = sum(samples) / len(samples)
            # Convert to voltage (3.3V / 4095 counts)
            voltage = (avg_sample * 3.3) / 4095
            
            # ACS712-30A: 2.5V offset, 66mV/A sensitivity
            current_ac = abs(voltage - 2.5) / 0.066
            return current_ac
        except Exception as e:
            print(f"ACS712 read error: {e}")
            return None
    
    def read_all_sensors(self):
        """Read all sensor data"""
        temperature, humidity = self.read_dht22()
        voltage = self.read_ina219_voltage()
        current_dc = self.read_ina219_current()
        current_ac = self.read_acs712()
        
        # Calculate power
        power = voltage * current_dc if voltage and current_dc else None
        
        return {
            'temperature': temperature,
            'humidity': humidity,
            'voltage': voltage,
            'current_dc': current_dc,
            'current_ac': current_ac,
            'power': power,
            'timestamp': time.time()
        }

def connect_wifi():
    """Connect to Wi-Fi network"""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    
    if not wlan.isconnected():
        print('Connecting to Wi-Fi...')
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        
        timeout = 0
        while not wlan.isconnected() and timeout < 30:
            time.sleep(1)
            timeout += 1
        
        if wlan.isconnected():
            print('Wi-Fi connected:', wlan.ifconfig())
            return True
        else:
            print('Wi-Fi connection failed')
            return False
    return True

def send_sensor_data(sensor_data, station_id="STATION_001"):
    """Send sensor data to the web application"""
    try:
        payload = {
            'station_id': station_id,
            'sensor_data': sensor_data,
            'device_type': 'ESP32',
            'location': {'lat': 40.7128, 'lng': -74.0060}  # Replace with actual GPS
        }
        
        headers = {'Content-Type': 'application/json'}
        response = urequests.post(
            f"{SERVER_URL}/sensors/data",
            data=ujson.dumps(payload),
            headers=headers
        )
        
        if response.status_code == 200:
            print("Data sent successfully")
            return True
        else:
            print(f"Server error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Network error: {e}")
        return False

def main():
    """Main application loop"""
    print("Starting Solar EV Charging Station Monitor...")
    
    # Connect to Wi-Fi
    if not connect_wifi():
        print("Cannot proceed without Wi-Fi connection")
        return
    
    # Initialize sensor manager
    sensor_manager = SensorManager()
    
    # Main monitoring loop
    while True:
        try:
            # Read sensor data
            sensor_data = sensor_manager.read_all_sensors()
            
            # Print data for debugging
            print("Sensor Data:")
            print(f"  Temperature: {sensor_data['temperature']}°C")
            print(f"  Humidity: {sensor_data['humidity']}%")
            print(f"  Voltage: {sensor_data['voltage']}V")
            print(f"  DC Current: {sensor_data['current_dc']}A")
            print(f"  AC Current: {sensor_data['current_ac']}A")
            print(f"  Power: {sensor_data['power']}W")
            print("-" * 40)
            
            # Send data to server
            send_sensor_data(sensor_data)
            
            # Wait 10 seconds before next reading
            time.sleep(10)
            
        except KeyboardInterrupt:
            print("Monitoring stopped by user")
            break
        except Exception as e:
            print(f"Error in main loop: {e}")
            time.sleep(5)  # Wait before retrying

if __name__ == "__main__":
    main()