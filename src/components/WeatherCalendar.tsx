
import { Card, CardContent } from "@/components/ui/card";
import { ForecastWeather, getWeatherIconUrl, formatDateTime } from "@/lib/apiWeather";

interface WeatherCalendarProps {
  forecast: ForecastWeather[];
}

const WeatherCalendar = ({ forecast }: WeatherCalendarProps) => {
  // Group forecast by day and get daily averages for 7 days
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
          fullDate: new Date(items[0].dt * 1000).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
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
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-center">7-Day Weather Outlook</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {dailyForecasts.map((day, index) => (
          <Card key={index} className="p-4 text-center hover:bg-muted/50 transition-colors">
            <CardContent className="p-0 space-y-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold">
                  {index === 0 ? "Today" : day.dayName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {day.fullDate}
                </div>
              </div>
              
              <img
                src={getWeatherIconUrl(day.icon)}
                alt={day.description}
                className="w-12 h-12 mx-auto"
              />
              
              <div className="space-y-1">
                <div className="text-lg font-bold">
                  {day.maxTemp}°
                </div>
                <div className="text-sm text-muted-foreground">
                  {day.minTemp}°
                </div>
              </div>
              
              <div className="text-xs capitalize text-muted-foreground">
                {day.description}
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-blue-500">{day.precipitation}%</span>
                <span className="text-muted-foreground">{day.humidity}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherCalendar;
