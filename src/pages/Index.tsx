
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchCurrentWeather, getTimeOfDay, getWeatherBackground, CurrentWeather as CurrentWeatherType } from "@/lib/apiWeather";
import { Cloud, CloudSun, Brain, TrendingUp, Clock, Calendar } from "lucide-react";

const Index = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>("");
  const navigate = useNavigate();

  // Load saved city and weather data on component mount
  useEffect(() => {
    const savedCity = localStorage.getItem('skycast-searched-city');
    const savedWeather = localStorage.getItem('skycast-current-weather');
    
    if (savedCity && savedWeather) {
      try {
        setSearchedCity(savedCity);
        setCurrentWeather(JSON.parse(savedWeather));
      } catch (error) {
        console.error('Error parsing saved weather data:', error);
        localStorage.removeItem('skycast-searched-city');
        localStorage.removeItem('skycast-current-weather');
      }
    }
  }, []);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const weather = await fetchCurrentWeather(city);
      setCurrentWeather(weather);
      setSearchedCity(city);
      
      // Save to localStorage
      localStorage.setItem('skycast-searched-city', city);
      localStorage.setItem('skycast-current-weather', JSON.stringify(weather));
      
      toast.success(`Weather data loaded for ${city}`);
    } catch (error: any) {
      console.error("Error fetching weather:", error);
      setError(error.message || "Failed to fetch weather data");
      setCurrentWeather(null);
      toast.error(error.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module: string) => {
    if (!searchedCity) {
      toast.error("Please search for a city first");
      return;
    }
    navigate(`/${module}/${encodeURIComponent(searchedCity)}`);
  };

  // Set background based on current weather
  useEffect(() => {
    if (currentWeather) {
      const timeOfDay = getTimeOfDay(
        currentWeather.dt,
        currentWeather.sunrise,
        currentWeather.sunset
      );
      const backgroundClass = getWeatherBackground(
        currentWeather.condition,
        timeOfDay
      );
      
      document.body.className = backgroundClass;
    } else {
      document.body.className = "weather-gradient-day";
    }
    
    return () => {
      document.body.className = "";
    };
  }, [currentWeather]);

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
        <SearchBar onSearch={handleSearch} isLoading={loading} />
      </div>
      
      {error && (
        <Card className="mb-8 bg-red-50 border-red-200 dark:bg-red-900/20">
          <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      )}
      
      {!currentWeather && !loading && !error && (
        <div className="text-center py-12">
          <Cloud className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Welcome to SkyCast AI</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search for a city to get current weather and explore detailed forecasts through our modules.
          </p>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-12 animate-pulse">
          <div className="h-16 w-16 rounded-full bg-primary/30 mx-auto mb-4"></div>
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-muted/80 rounded mx-auto"></div>
        </div>
      )}
      
      {currentWeather && (
        <div className="space-y-8 animate-fade-in">
          <CurrentWeather data={currentWeather} />
          
          {/* Weather Modules Grid */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Explore Weather Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module 1: AI Weather Insights */}
              <Card 
                className="weather-card glass-card cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleModuleClick('ai-insights')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="h-8 w-8 text-purple-500 mr-3" />
                    <h3 className="text-xl font-semibold">AI Weather Insights</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Get intelligent weather analysis and personalized recommendations powered by AI.
                  </p>
                </div>
              </Card>

              {/* Module 2: Weather Comparison */}
              <Card 
                className="weather-card glass-card cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleModuleClick('weather-comparison')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
                    <h3 className="text-xl font-semibold">Weather Comparison</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Compare today's weather with yesterday's conditions side by side.
                  </p>
                </div>
              </Card>

              {/* Module 3: Hourly Forecast */}
              <Card 
                className="weather-card glass-card cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleModuleClick('hourly-forecast')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-8 w-8 text-green-500 mr-3" />
                    <h3 className="text-xl font-semibold">Hourly Forecast</h3>
                  </div>
                  <p className="text-muted-foreground">
                    View detailed hour-by-hour weather forecast for the next 24 hours.
                  </p>
                </div>
              </Card>

              {/* Module 4: Weather Calendar */}
              <Card 
                className="weather-card glass-card cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleModuleClick('weather-calendar')}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-8 w-8 text-orange-500 mr-3" />
                    <h3 className="text-xl font-semibold">Weather Calendar</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Explore the 7-day weather forecast in an easy-to-read calendar format.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
