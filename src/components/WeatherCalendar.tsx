
import { Card, CardContent } from "@/components/ui/card";
import { ForecastWeather, getWeatherIconUrl, formatDateTime } from "@/lib/apiWeather";

interface WeatherCalendarProps {
  forecast: ForecastWeather[];
}

const WeatherCalendar = ({ forecast }: WeatherCalendarProps) => {
  // Group forecast by day and get daily averages
  const getDailyForecasts = () => {
    const dailyData: Record<string, ForecastWeather[]> = {};
    
    forecast.forEach(item => {
      const date = formatDateTime(item.dt, "date");
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    return Object.entries(dailyData)
      .slice(0, 7) // Get next 7 days
      .map(([date, items]) => {
        const avgTemp = items.reduce((sum, item) => sum + item.temp, 0) / items.length;
        const maxTemp = Math.max(...items.map(item => item.temp));
        const minTemp = Math.min(...items.map(item => item.temp));
        const avgHumidity = items.reduce((sum, item) => sum + item.humidity, 0) / items.length;
        const maxPop = Math.max(...items.map(item => item.pop));
        
        // Get midday forecast for icon (or closest available)
        const midDayForecast = items.find(item => {
          const hour = new Date(item.dt * 1000).getHours();
          return hour >= 12 && hour <= 15;
        }) || items[Math.floor(items.length / 2)];

        return {
          date,
          avgTemp: Math.round(avgTemp),
          maxTemp: Math.round(maxTemp),
          minTemp: Math.round(minTemp),
          humidity: Math.round(avgHumidity),
          precipitation: Math.round(maxPop * 100),
          icon: midDayForecast.icon,
          description: midDayForecast.description,
          dayName: formatDateTime(items[0].dt, "day"),
        };
      });
  };

  const dailyForecasts = getDailyForecasts();

  if (dailyForecasts.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">7-Day Outlook</h4>
      
      <div className="grid grid-cols-1 gap-2">
        {dailyForecasts.map((day, index) => (
          <Card key={index} className="p-3 hover:bg-muted/50 transition-colors">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium min-w-[3rem]">
                    {index === 0 ? "Today" : day.dayName}
                  </div>
                  
                  <img
                    src={getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="w-6 h-6"
                  />
                  
                  <div className="text-xs text-muted-foreground capitalize truncate max-w-[6rem]">
                    {day.description}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">{day.maxTemp}°</div>
                    <div className="text-xs text-muted-foreground">{day.minTemp}°</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-blue-500">{day.precipitation}%</div>
                    <div className="text-xs text-muted-foreground">{day.humidity}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherCalendar;
