
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrentWeather as CurrentWeatherType, getTimeOfDay, getWeatherIconUrl, formatDateTime } from "@/lib/apiWeather";
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const timeOfDay = getTimeOfDay(data.dt, data.sunrise, data.sunset);
  
  return (
    <Card className={`weather-card animate-fade-in glass-card ${timeOfDay === "day" ? "bg-blue-50/80" : "bg-blue-900/30 text-white"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {data.city}, {data.country}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {formatDateTime(data.dt, "full")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(data.temp)}°C</div>
            <p className="text-muted-foreground text-sm">
              Feels like {Math.round(data.feels_like)}°C
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={getWeatherIconUrl(data.icon)} 
              alt={data.description}
              className="w-16 h-16"
            />
            <span className="capitalize text-lg">{data.description}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Thermometer className="h-5 w-5" />
              <span className="text-sm">Humidity</span>
              <span className="font-medium">{data.humidity}%</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Wind className="h-5 w-5" />
              <span className="text-sm">Wind</span>
              <span className="font-medium">{data.wind_speed} m/s</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Cloud className="h-5 w-5" />
              <span className="text-sm">Condition</span>
              <span className="font-medium capitalize">{data.condition}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
