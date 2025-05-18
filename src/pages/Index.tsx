
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
    <div className="app max-w-7xl mx-auto">
      <ThemeToggle />
      
      <header className="app__header animate-fade-in">
        <h1 className="flex items-center justify-center">
          <CloudSun className="icon icon--lg mr-2 text-sky-500" />
          SkyCast AI
        </h1>
        <p className="text-muted">AI-powered weather insights</p>
      </header>
      
      <div className="flex flex--center mb-8">
        <SearchBar onSearch={handleSearch} isLoading={weatherData.loading} />
      </div>
      
      {weatherData.error && (
        <Card className="card mb-8 card--error">
          <CardContent className="card__content p-4 text-center text-red-600">
            {weatherData.error}
          </CardContent>
        </Card>
      )}
      
      {!weatherData.current && !weatherData.loading && !weatherData.error && (
        <div className="text-center py-12">
          <Cloud className="icon icon--lg mx-auto text-muted mb-4" />
          <h2 className="text-2xl font-medium mb-2">Welcome to SkyCast AI</h2>
          <p className="text-muted max-w-md mx-auto">
            Search for a city to get current weather, forecast, trends, and AI-powered insights.
          </p>
        </div>
      )}
      
      {weatherData.loading && (
        <div className="text-center py-12 animate-pulse">
          <div className="loader mx-auto mb-4"></div>
          <div className="loading-placeholder mx-auto mb-2"></div>
          <div className="loading-placeholder-sm mx-auto"></div>
        </div>
      )}
      
      {weatherData.current && (
        <div className="app__content space-y-8 animate-fade-in">
          <CurrentWeather data={weatherData.current} />
          
          <div className="grid grid--cols-1 grid--cols-md-2 grid__gap-6">
            <ForecastWeather forecast={weatherData.forecast} />
            <AIInsights weatherData={weatherData} />
          </div>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="tabs__list mb-4">
              <TabsTrigger value="temperature" className="tabs__trigger">Temperature</TabsTrigger>
              <TabsTrigger value="humidity" className="tabs__trigger">Humidity</TabsTrigger>
              <TabsTrigger value="precipitation" className="tabs__trigger">Precipitation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temperature" className="tabs__content">
              <WeatherChart forecast={weatherData.forecast} type="temperature" />
            </TabsContent>
            <TabsContent value="humidity" className="tabs__content">
              <WeatherChart forecast={weatherData.forecast} type="humidity" />
            </TabsContent>
            <TabsContent value="precipitation" className="tabs__content">
              <WeatherChart forecast={weatherData.forecast} type="precipitation" />
            </TabsContent>
          </Tabs>
          
          <ChatBot weatherData={weatherData} />
          
          <footer className="app__footer">
            <p className="text-muted text-sm">SkyCast AI - Weather data powered by wttr.in</p>
            <p className="text-muted text-sm mt-1">
              <small>© 2025 SkyCast AI - All Rights Reserved</small>
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
