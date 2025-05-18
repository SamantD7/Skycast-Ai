
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
          <CloudSun className="h-10 w-10 mr-2" style={{ height: '2.5rem', width: '2.5rem', marginRight: '0.5rem', color: '#0ea5e9' }} />
          SkyCast AI
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>AI-powered weather insights</p>
      </header>
      
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} isLoading={weatherData.loading} />
      </div>
      
      {weatherData.error && (
        <Card className="mb-8" style={{ backgroundColor: 'rgba(254, 226, 226, 0.5)', borderColor: 'rgba(248, 113, 113, 0.2)' }}>
          <CardContent className="p-4 text-center" style={{ color: '#dc2626' }}>
            {weatherData.error}
          </CardContent>
        </Card>
      )}
      
      {!weatherData.current && !weatherData.loading && !weatherData.error && (
        <div className="text-center py-12">
          <Cloud className="h-16 w-16 mx-auto mb-4" style={{ 
            height: '4rem', 
            width: '4rem', 
            margin: '0 auto 1rem auto', 
            color: 'var(--muted-foreground)', 
            opacity: 0.6
          }} />
          <h2 className="text-2xl font-medium mb-2">Welcome to SkyCast AI</h2>
          <p style={{ 
            color: 'var(--muted-foreground)', 
            maxWidth: '28rem', 
            margin: '0 auto' 
          }}>
            Search for a city to get current weather, forecast, trends, and AI-powered insights.
          </p>
        </div>
      )}
      
      {weatherData.loading && (
        <div className="text-center py-12 animate-pulse">
          <div style={{ 
            height: '4rem', 
            width: '4rem', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(59, 130, 246, 0.3)', 
            margin: '0 auto 1rem auto' 
          }}></div>
          <div style={{ 
            height: '1.5rem', 
            width: '8rem', 
            backgroundColor: 'var(--muted)', 
            borderRadius: '0.25rem', 
            margin: '0 auto 0.5rem auto' 
          }}></div>
          <div style={{ 
            height: '1rem', 
            width: '16rem', 
            backgroundColor: 'var(--muted)', 
            opacity: 0.8, 
            borderRadius: '0.25rem', 
            margin: '0 auto' 
          }}></div>
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
          
          <footer className="text-center text-sm pt-6 pb-20" style={{ color: 'var(--muted-foreground)' }}>
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
