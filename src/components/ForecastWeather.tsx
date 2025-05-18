
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
      <CardHeader className="card__header">
        <CardTitle className="card__title">3-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="card__content">
        <div className="grid grid--cols-1 grid--cols-md-5 grid__gap-4">
          {Object.entries(dailyForecasts)
            .slice(0, 5)
            .map(([date, forecasts]) => {
              const dayAvg = getDayAverage(forecasts);
              const midDayForecast = forecasts.find(
                (f) => new Date(f.dt * 1000).getHours() >= 12 && new Date(f.dt * 1000).getHours() <= 15
              ) || forecasts[0];
              
              return (
                <Card key={date} className="card p-3 flex flex--column items-center">
                  <h3 className="font-medium text-center">
                    {formatDateTime(forecasts[0].dt, "day")}
                  </h3>
                  <img
                    src={getWeatherIconUrl(midDayForecast.icon)}
                    alt={midDayForecast.description}
                    className="weather__icon weather__icon--sm my-2"
                  />
                  <p className="weather__temp">{Math.round(dayAvg.temp)}°C</p>
                  <div className="text-muted text-xs mt-1 flex flex--column items-center space-y-1">
                    <div className="flex items-center">
                      <Droplets className="icon icon--xs mr-1" />
                      <span>{Math.round(dayAvg.humidity)}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="icon icon--xs mr-1" />
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
