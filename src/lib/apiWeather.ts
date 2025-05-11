
// Weather data types
export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  dt: number;
  sunrise: number;
  sunset: number;
  condition: string;
}

export interface ForecastWeather {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  pop: number; // probability of precipitation
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastWeather[];
  loading: boolean;
  error: string | null;
}

// Function to fetch current weather using wttr.in API (no API key required)
export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  try {
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      { 
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error("Failed to fetch weather data");
    }
    
    const data = await response.json();
    const current = data.current_condition[0];
    const nearest_area = data.nearest_area[0];
    const astronomy = data.weather[0].astronomy[0];
    
    // Convert sunrise/sunset times to timestamps
    const today = new Date();
    const datePart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const sunriseTime = new Date(`${datePart} ${astronomy.sunrise}`).getTime() / 1000;
    const sunsetTime = new Date(`${datePart} ${astronomy.sunset}`).getTime() / 1000;
    
    return {
      city: nearest_area.areaName[0].value,
      country: nearest_area.country[0].value,
      temp: parseInt(current.temp_C),
      feels_like: parseInt(current.FeelsLikeC),
      humidity: parseInt(current.humidity),
      wind_speed: parseFloat(current.windspeedKmph) / 3.6, // Convert from kmph to m/s
      description: current.weatherDesc[0].value,
      icon: current.weatherCode,
      dt: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      sunrise: sunriseTime,
      sunset: sunsetTime,
      condition: mapWeatherCondition(parseInt(current.weatherCode)),
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

// Function to fetch forecast using wttr.in API (no API key required)
export async function fetchForecastWeather(city: string): Promise<ForecastWeather[]> {
  try {
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      { 
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error("Failed to fetch forecast data");
    }
    
    const data = await response.json();
    
    // Process data to get one forecast per day
    return data.weather.slice(0, 5).flatMap((day: any) => {
      // Use hourly data to simulate the 3-hour forecast format from OpenWeatherMap
      return day.hourly.filter((_: any, i: number) => i % 2 === 0).map((hour: any) => {
        // Convert day and hour to timestamp
        const date = new Date(day.date);
        const hourNum = parseInt(hour.time) / 100;
        date.setHours(hourNum, 0, 0, 0);
        
        return {
          dt: Math.floor(date.getTime() / 1000),
          temp: parseInt(hour.tempC),
          feels_like: parseInt(hour.FeelsLikeC),
          humidity: parseInt(hour.humidity),
          wind_speed: parseFloat(hour.windspeedKmph) / 3.6, // Convert from kmph to m/s
          description: hour.weatherDesc[0].value,
          icon: hour.weatherCode,
          pop: parseInt(hour.chanceofrain) / 100, // Convert percentage to decimal
        };
      });
    });
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

// Function to map weather condition codes to simplified conditions
export function mapWeatherCondition(code: number): string {
  // Based on wttr.in weather codes
  if ([395, 392, 389, 386, 200, 386, 389, 392, 395].includes(code)) return "stormy"; // Thunderstorm
  if ([266, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 353, 356, 359, 362, 365, 368, 371, 374, 377].includes(code)) return "rainy"; // Rain
  if ([179, 182, 185, 227, 230, 281, 284, 317, 320, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377].includes(code)) return "snowy"; // Snow
  if ([143, 248, 260].includes(code)) return "cloudy"; // Fog
  if ([113].includes(code)) return "sunny"; // Clear
  if ([116, 119, 122].includes(code)) return "cloudy"; // Clouds
  
  return "sunny"; // Default
}

// Function to get time of day based on current time and sunrise/sunset
export function getTimeOfDay(current: number, sunrise: number, sunset: number): "day" | "night" {
  if (current > sunrise && current < sunset) {
    return "day";
  } else {
    return "night";
  }
}

// Function to get weather icon URL from icon code
export function getWeatherIconUrl(icon: string): string {
  // Map wttr.in weather codes to appropriate icons
  // Either using a custom mapping to OpenWeatherMap icons or using a different icon set
  const iconCode = mapWttrIconToOWM(icon);
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Map wttr.in weather codes to OpenWeatherMap-compatible icon codes
function mapWttrIconToOWM(wttrCode: string): string {
  const code = parseInt(wttrCode);
  
  // Sunny / Clear
  if (code === 113) return "01d";
  
  // Partly cloudy
  if (code === 116) return "02d";
  
  // Cloudy
  if ([119, 122].includes(code)) return "03d";
  
  // Fog
  if ([143, 248, 260].includes(code)) return "50d";
  
  // Rain
  if ([176, 293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359, 362].includes(code)) return "10d";
  
  // Snow
  if ([179, 227, 230, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377].includes(code)) return "13d";
  
  // Thunderstorm
  if ([200, 386, 389, 392, 395].includes(code)) return "11d";
  
  return "01d"; // Default to clear/sunny
}

// Get an appropriate background gradient class based on weather condition and time of day
export function getWeatherBackground(condition: string, timeOfDay: "day" | "night"): string {
  if (timeOfDay === "night") {
    return "weather-gradient-night";
  }
  
  switch (condition) {
    case "cloudy":
      return "weather-gradient-cloudy";
    case "rainy":
    case "stormy":
      return "weather-gradient-rainy";
    case "sunny":
    default:
      return "weather-gradient-day";
  }
}

// Function to format a Unix timestamp to a readable date/time
export function formatDateTime(timestamp: number, format: "date" | "time" | "day" | "full" = "full"): string {
  const date = new Date(timestamp * 1000);
  
  if (format === "date") {
    return date.toLocaleDateString();
  } else if (format === "time") {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (format === "day") {
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  } else {
    return date.toLocaleString();
  }
}
