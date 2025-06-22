
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import WeatherComparison from "@/components/WeatherComparison";
import { fetchCurrentWeather, CurrentWeather } from "@/lib/apiWeather";

const WeatherComparisonPage = () => {
  const { city } = useParams<{ city: string }>();
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      if (!city) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const weather = await fetchCurrentWeather(decodeURIComponent(city));
        setCurrentWeather(weather);
      } catch (error: any) {
        console.error("Error fetching weather:", error);
        setError(error.message || "Failed to fetch weather data");
        toast.error(error.message || "Failed to fetch weather data");
      } finally {
        setLoading(false);
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
          <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold">Weather Comparison</h1>
            <p className="text-muted-foreground">
              Today vs Yesterday for {decodeURIComponent(city)}
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 animate-pulse">
          <div className="h-16 w-16 rounded-full bg-primary/30 mx-auto mb-4"></div>
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-muted/80 rounded mx-auto"></div>
        </div>
      )}

      {error && (
        <Card className="bg-red-50 border-red-200 dark:bg-red-900/20">
          <CardContent className="p-4 text-center text-red-600 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      )}

      {currentWeather && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Today vs Yesterday Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherComparison currentWeather={currentWeather} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherComparisonPage;
