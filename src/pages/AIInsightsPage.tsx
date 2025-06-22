
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { toast } from "sonner";
import AIInsights from "@/components/AIInsights";
import { fetchCurrentWeather, fetchForecastWeather, WeatherData } from "@/lib/apiWeather";

const AIInsightsPage = () => {
  const { city } = useParams<{ city: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData>({
    current: null as any,
    forecast: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!city) return;
      
      setWeatherData(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const current = await fetchCurrentWeather(decodeURIComponent(city));
        const forecast = await fetchForecastWeather(decodeURIComponent(city));
        
        setWeatherData({
          current,
          forecast,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        console.error("Error fetching weather:", error);
        setWeatherData(prev => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to fetch weather data",
        }));
        toast.error(error.message || "Failed to fetch weather data");
      }
    };

    loadWeatherData();
  }, [city]);

  if (!city) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">City not found</h1>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center mb-6">
          <Brain className="h-8 w-8 text-purple-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">AI Weather Insights</h1>
            <p className="text-muted-foreground">
              Intelligent weather analysis for {decodeURIComponent(city)}
            </p>
          </div>
        </div>
      </div>

      {weatherData.loading && (
        <div className="text-center py-12 animate-pulse">
          <div className="h-16 w-16 rounded-full bg-primary/30 mx-auto mb-4"></div>
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-muted/80 rounded mx-auto"></div>
        </div>
      )}

      {weatherData.error && (
        <Card className="bg-red-50 border-red-200 dark:bg-red-900/20">
          <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
            {weatherData.error}
          </CardContent>
        </Card>
      )}

      {weatherData.current && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>AI-Powered Weather Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <AIInsights weatherData={weatherData} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIInsightsPage;
