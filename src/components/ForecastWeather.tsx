
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastWeather as ForecastWeatherType, getWeatherIconUrl, formatDateTime } from "@/lib/apiWeather";
import { Droplets, Wind } from "lucide-react";

interface ForecastWeatherProps {
  forecast: ForecastWeatherType[];
}

const ForecastWeather = ({ forecast }: ForecastWeatherProps) => {
  // Group forecast by day
  const dailyForecasts = forecast.reduce((acc: Record<string, ForecastWeatherType[]>, item) => {
    const date = formatDateTime(item.dt, "date");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const getDayAverage = (forecasts: ForecastWeatherType[]) => {
    const total = forecasts.reduce(
      (acc, item) => {
        acc.temp += item.temp;
        acc.humidity += item.humidity;
        acc.pop += item.pop;
        return acc;
      },
      { temp: 0, humidity: 0, pop: 0 }
    );
    
    return {
      temp: total.temp / forecasts.length,
      humidity: total.humidity / forecasts.length,
      pop: total.pop / forecasts.length,
    };
  };

  return (
    <Card className="weather-card glass-card">
      <CardHeader>
        <CardTitle className="text-xl">3-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(dailyForecasts)
            .slice(0, 5)
            .map(([date, forecasts]) => {
              const dayAvg = getDayAverage(forecasts);
              const midDayForecast = forecasts.find(
                (f) => new Date(f.dt * 1000).getHours() >= 12 && new Date(f.dt * 1000).getHours() <= 15
              ) || forecasts[0];
              
              return (
                <Card key={date} className="p-3 flex flex-col items-center">
                  <h3 className="font-medium text-center">
                    {formatDateTime(forecasts[0].dt, "day")}
                  </h3>
                  <img
                    src={getWeatherIconUrl(midDayForecast.icon)}
                    alt={midDayForecast.description}
                    className="w-12 h-12 my-2"
                  />
                  <p className="text-xl font-bold">{Math.round(dayAvg.temp)}°C</p>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-col items-center space-y-1">
                    <div className="flex items-center">
                      <Droplets className="h-3 w-3 mr-1" />
                      <span>{Math.round(dayAvg.humidity)}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-3 w-3 mr-1" />
                      <span>Precip: {Math.round(dayAvg.pop * 100)}%</span>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWeather;
