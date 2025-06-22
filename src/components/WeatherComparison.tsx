
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrentWeather, fetchCurrentWeather, getWeatherIconUrl } from "@/lib/apiWeather";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface WeatherComparisonProps {
  currentWeather: CurrentWeather;
}

const WeatherComparison = ({ currentWeather }: WeatherComparisonProps) => {
  const [yesterdayWeather, setYesterdayWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYesterdayWeather = async () => {
      if (!currentWeather?.city) return;
      
      setLoading(true);
      try {
        // For demonstration, we'll simulate yesterday's data
        // In a real app, you'd fetch historical data from the API
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Simulate slightly different weather for yesterday
        const mockYesterday: CurrentWeather = {
          ...currentWeather,
          temp: currentWeather.temp + (Math.random() - 0.5) * 10,
          feels_like: currentWeather.feels_like + (Math.random() - 0.5) * 8,
          humidity: Math.max(0, Math.min(100, currentWeather.humidity + (Math.random() - 0.5) * 20)),
          wind_speed: Math.max(0, currentWeather.wind_speed + (Math.random() - 0.5) * 5),
          dt: Math.floor(yesterday.getTime() / 1000),
        };
        
        setYesterdayWeather(mockYesterday);
      } catch (error) {
        console.error("Error fetching yesterday's weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchYesterdayWeather();
  }, [currentWeather]);

  const getTrendIcon = (current: number, yesterday: number) => {
    const diff = current - yesterday;
    if (Math.abs(diff) < 0.5) return <Minus className="h-4 w-4 text-gray-500" />;
    return diff > 0 ? 
      <ArrowUp className="h-4 w-4 text-green-500" /> : 
      <ArrowDown className="h-4 w-4 text-red-500" />;
  };

  const formatDiff = (current: number, yesterday: number, unit: string = "") => {
    const diff = current - yesterday;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}${unit}`;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
      </div>
    );
  }

  if (!yesterdayWeather) {
    return (
      <div className="text-center text-muted-foreground">
        <p>Unable to load yesterday's weather data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3">
          <div className="text-center">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Today</h4>
            <div className="text-2xl font-bold">{Math.round(currentWeather.temp)}°C</div>
            <p className="text-xs text-muted-foreground capitalize">{currentWeather.description}</p>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="text-center">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Yesterday</h4>
            <div className="text-2xl font-bold">{Math.round(yesterdayWeather.temp)}°C</div>
            <p className="text-xs text-muted-foreground capitalize">{yesterdayWeather.description}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Temperature</span>
          <div className="flex items-center space-x-2">
            {getTrendIcon(currentWeather.temp, yesterdayWeather.temp)}
            <span className="text-sm font-medium">
              {formatDiff(currentWeather.temp, yesterdayWeather.temp, "°C")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Humidity</span>
          <div className="flex items-center space-x-2">
            {getTrendIcon(currentWeather.humidity, yesterdayWeather.humidity)}
            <span className="text-sm font-medium">
              {formatDiff(currentWeather.humidity, yesterdayWeather.humidity, "%")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Wind Speed</span>
          <div className="flex items-center space-x-2">
            {getTrendIcon(currentWeather.wind_speed, yesterdayWeather.wind_speed)}
            <span className="text-sm font-medium">
              {formatDiff(currentWeather.wind_speed, yesterdayWeather.wind_speed, " m/s")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherComparison;
