
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherData } from "@/lib/apiWeather";
import { Sparkles, Loader2 } from "lucide-react";

interface AIInsightsProps {
  weatherData: WeatherData;
}

const AIInsights = ({ weatherData }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Generate insights based on current weather data without API call
  const generateInsights = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const generatedInsights = getWeatherInsights(weatherData);
      setInsights(generatedInsights);
      setLoading(false);
    }, 1000);
  };

  // Generate insights automatically when weather data changes
  useEffect(() => {
    if (weatherData.current) {
      generateInsights();
    }
  }, [weatherData.current]);

  // Custom function to generate weather insights based on data patterns
  const getWeatherInsights = (data: WeatherData): string => {
    if (!data.current) return "";
    
    const current = data.current;
    const forecast = data.forecast;
    const insights = [];
    
    // Temperature insights
    if (current.temp > 30) {
      insights.push("• High temperature alert! Stay hydrated and seek shade when outdoors");
    } else if (current.temp > 25) {
      insights.push("• Warm conditions expected. Light clothing recommended for comfort");
    } else if (current.temp < 5) {
      insights.push("• Very cold conditions. Bundle up with multiple layers when going outside");
    } else if (current.temp < 10) {
      insights.push("• Cool temperatures today. A jacket or sweater is recommended");
    }
    
    // Humidity insights
    if (current.humidity > 80) {
      insights.push("• High humidity may make it feel warmer than it is. Stay hydrated");
    } else if (current.humidity < 30) {
      insights.push("• Low humidity may cause dry skin and throat. Consider using moisturizer");
    }
    
    // Wind insights
    if (current.wind_speed > 10) {
      insights.push("• Strong winds expected. Secure loose objects outdoors");
    } else if (current.wind_speed > 5) {
      insights.push("• Moderate winds may affect outdoor activities like cycling");
    }
    
    // Weather condition insights
    if (current.condition === "rainy") {
      insights.push("• Rain expected. Carry an umbrella and wear water-resistant footwear");
    } else if (current.condition === "stormy") {
      insights.push("• Stormy conditions forecasted. Consider postponing outdoor activities");
    } else if (current.condition === "snowy") {
      insights.push("• Snow expected. Drive carefully and wear slip-resistant footwear");
    } else if (current.condition === "sunny") {
      insights.push("• Clear skies and sunshine today. Great for outdoor activities");
    } else if (current.condition === "cloudy") {
      insights.push("• Cloudy conditions may provide relief from direct sunlight");
    }
    
    // Forecast insights
    if (forecast && forecast.length > 0) {
      const tomorrowForecast = forecast.find(f => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const forecastDate = new Date(f.dt * 1000);
        return forecastDate.getDate() === tomorrow.getDate();
      });
      
      if (tomorrowForecast) {
        if (tomorrowForecast.temp > current.temp + 5) {
          insights.push("• Temperature rising significantly tomorrow. Plan wardrobe accordingly");
        } else if (tomorrowForecast.temp < current.temp - 5) {
          insights.push("• Temperature dropping tomorrow. Prepare for cooler conditions");
        }
        
        if (tomorrowForecast.pop > 0.5) {
          insights.push("• High chance of precipitation tomorrow. Plan indoor alternatives");
        }
      }
      
      // Check for consistent rain pattern
      const rainForecasts = forecast.filter(f => f.description.toLowerCase().includes("rain"));
      if (rainForecasts.length > 2) {
        insights.push("• Persistent rain expected over the coming days. Plan accordingly");
      }
    }
    
    // Special time-based insights
    const now = new Date();
    const hour = now.getHours();
    if (hour < 10 && current.condition !== "rainy" && current.condition !== "stormy") {
      insights.push("• Good morning weather for a walk or outdoor exercise");
    } else if (hour > 16 && hour < 20 && current.temp > 15) {
      insights.push("• Pleasant evening conditions. Consider outdoor dining or activities");
    }
    
    // If we couldn't generate specific insights
    if (insights.length === 0) {
      insights.push("• Regular weather conditions. No special precautions needed");
      insights.push("• Check forecast regularly for any changes to conditions");
    }
    
    // Limit to 4 insights maximum
    return insights.slice(0, 4).join("\n");
  };

  return (
    <Card className="weather-card glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
            AI Weather Insights
          </div>
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={generateInsights}
          disabled={loading || !weatherData.current}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Analyzing weather patterns...
            </p>
          </div>
        ) : (
          <div className="whitespace-pre-line">
            {insights}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
