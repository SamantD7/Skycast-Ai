
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import ForecastWeather from "@/components/ForecastWeather";
import WeatherChart from "@/components/WeatherChart";
import AIInsights from "@/components/AIInsights";
import ChatBot from "@/components/ChatBot";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchCurrentWeather, fetchForecastWeather, getTimeOfDay, getWeatherBackground, WeatherData } from "@/lib/apiWeather";
import { Cloud, CloudSun } from "lucide-react";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: null as any,
    forecast: [],
    loading: false,
    error: null,
  });
  const [activeTab, setActiveTab] = useState<"temperature" | "humidity" | "precipitation">("temperature");

  const handleSearch = async (city: string) => {
    setWeatherData((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const current = await fetchCurrentWeather(city);
      const forecast = await fetchForecastWeather(city);
      
      setWeatherData({
        current,
        forecast,
        loading: false,
        error: null,
      });
      
      toast.success(`Weather data loaded for ${city}`);
    } catch (error: any) {
      console.error("Error fetching weather:", error);
      setWeatherData((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch weather data",
      }));
      toast.error(error.message || "Failed to fetch weather data");
    }
  };

  // Set background based on current weather
  useEffect(() => {
    if (weatherData.current) {
      const timeOfDay = getTimeOfDay(
        weatherData.current.dt,
        weatherData.current.sunrise,
        weatherData.current.sunset
      );
      const backgroundClass = getWeatherBackground(
        weatherData.current.condition,
        timeOfDay
      );
      
      document.body.className = backgroundClass;
    } else {
      // Default background
      document.body.className = "weather-gradient-day";
    }
    
    return () => {
      document.body.className = "";
    };
  }, [weatherData.current]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <ThemeToggle />
      
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
          <CloudSun className="h-10 w-10 mr-2 text-sky-500" />
          SkyCast AI
        </h1>
        <p className="text-muted-foreground">AI-powered weather insights</p>
      </header>
      
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} isLoading={weatherData.loading} />
      </div>
      
      {weatherData.error && (
        <Card className="mb-8 bg-red-50 border-red-200 dark:bg-red-900/20">
          <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
            {weatherData.error}
          </CardContent>
        </Card>
      )}
      
      {!weatherData.current && !weatherData.loading && !weatherData.error && (
        <div className="text-center py-12">
          <Cloud className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Welcome to SkyCast AI</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search for a city to get current weather, forecast, trends, and AI-powered insights.
          </p>
        </div>
      )}
      
      {weatherData.loading && (
        <div className="text-center py-12 animate-pulse">
          <div className="h-16 w-16 rounded-full bg-primary/30 mx-auto mb-4"></div>
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-muted/80 rounded mx-auto"></div>
        </div>
      )}
      
      {weatherData.current && (
        <div className="space-y-8 animate-fade-in">
          <CurrentWeather data={weatherData.current} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ForecastWeather forecast={weatherData.forecast} />
            <AIInsights weatherData={weatherData} />
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
              <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temperature">
              <WeatherChart forecast={weatherData.forecast} type="temperature" />
            </TabsContent>
            <TabsContent value="humidity">
              <WeatherChart forecast={weatherData.forecast} type="humidity" />
            </TabsContent>
            <TabsContent value="precipitation">
              <WeatherChart forecast={weatherData.forecast} type="precipitation" />
            </TabsContent>
          </Tabs>
          
          <ChatBot weatherData={weatherData} />
          
          <footer className="text-center text-sm text-muted-foreground pt-6 pb-20">
            <p>SkyCast AI - Weather data powered by wttr.in</p>
            <p className="mt-1">
              <small>© 2025 SkyCast AI - All Rights Reserved</small>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
