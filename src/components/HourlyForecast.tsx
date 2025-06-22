
import { Card, CardContent } from "@/components/ui/card";
import { ForecastWeather, getWeatherIconUrl, formatDateTime } from "@/lib/apiWeather";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import WeatherChart from "@/components/WeatherChart";

interface HourlyForecastProps {
  forecast: ForecastWeather[];
}

const HourlyForecast = ({ forecast }: HourlyForecastProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Get next 24 hours worth of data
  const next24Hours = forecast.slice(0, 8);

  if (next24Hours.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No hourly forecast available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <WeatherChart forecast={forecast} type="temperature" />
      
      {/* Humidity Chart */}
      <WeatherChart forecast={forecast} type="humidity" />
      
      {/* Precipitation Chart */}
      <WeatherChart forecast={forecast} type="precipitation" />

      {/* Scrollable Hourly Cards */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-muted-foreground">Next 24 Hours</h4>
          <div className="flex space-x-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
        >
          {next24Hours.map((item, index) => (
            <Card key={index} className="flex-shrink-0 w-20 p-3 text-center">
              <CardContent className="p-0 space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {formatDateTime(item.dt, "time")}
                </div>
                
                <img
                  src={getWeatherIconUrl(item.icon)}
                  alt={item.description}
                  className="w-8 h-8 mx-auto"
                />
                
                <div className="text-sm font-bold">
                  {Math.round(item.temp)}°
                </div>
                
                <div className="text-xs text-blue-500">
                  {Math.round(item.pop * 100)}%
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {item.humidity}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
