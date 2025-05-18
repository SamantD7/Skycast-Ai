
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrentWeather as CurrentWeatherType, getTimeOfDay, getWeatherIconUrl, formatDateTime } from "@/lib/apiWeather";
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react";

interface CurrentWeatherProps {
  data: CurrentWeatherType;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const timeOfDay = getTimeOfDay(data.dt, data.sunrise, data.sunset);
  const cardClass = `weather-card glass-card animate-fade-in ${timeOfDay === "day" ? "day-card" : "night-card"}`;
  
  return (
    <Card className={cardClass}>
      <CardHeader className="card__header pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="card__title text-2xl font-bold">
              {data.city}, {data.country}
            </CardTitle>
            <p className="text-muted text-sm">
              {formatDateTime(data.dt, "full")}
            </p>
          </div>
          <div className="text-right">
            <div className="weather__temp">{Math.round(data.temp)}°C</div>
            <p className="text-muted text-sm">
              Feels like {Math.round(data.feels_like)}°C
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="card__content">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={getWeatherIconUrl(data.icon)} 
              alt={data.description}
              className="weather__icon weather__icon--md"
            />
            <span className="capitalize text-lg">{data.description}</span>
          </div>
          
          <div className="weather__metrics">
            <div className="weather__metric">
              <Thermometer className="icon" />
              <span className="text-sm">Humidity</span>
              <span className="font-medium">{data.humidity}%</span>
            </div>
            
            <div className="weather__metric">
              <Wind className="icon" />
              <span className="text-sm">Wind</span>
              <span className="font-medium">{data.wind_speed} m/s</span>
            </div>
            
            <div className="weather__metric">
              <Cloud className="icon" />
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
