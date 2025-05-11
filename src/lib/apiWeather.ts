
// OpenWeatherMap API constants
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Users will need to replace this with their own key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

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

// Function to fetch current weather
export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error("Failed to fetch weather data");
    }
    
    const data = await response.json();
    
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      dt: data.dt,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      condition: mapWeatherCondition(data.weather[0].id),
    };
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

// Function to fetch 5-day forecast
export async function fetchForecastWeather(city: string): Promise<ForecastWeather[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error("Failed to fetch forecast data");
    }
    
    const data = await response.json();
    
    // Process data to get one forecast per day (noon time)
    return data.list.map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      pop: item.pop,
    }));
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

// Function to map weather condition codes to simplified conditions
export function mapWeatherCondition(code: number): string {
  // Based on OpenWeatherMap condition codes
  // https://openweathermap.org/weather-conditions
  
  if (code >= 200 && code < 300) return "stormy"; // Thunderstorm
  if (code >= 300 && code < 400) return "rainy"; // Drizzle
  if (code >= 500 && code < 600) return "rainy"; // Rain
  if (code >= 600 && code < 700) return "snowy"; // Snow
  if (code >= 700 && code < 800) return "cloudy"; // Atmosphere (fog, mist, etc)
  if (code === 800) return "sunny"; // Clear
  if (code > 800) return "cloudy"; // Clouds
  
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
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
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
