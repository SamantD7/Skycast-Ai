
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherData } from "@/lib/apiWeather";
import { generateWeatherInsights } from "@/lib/apiOpenAI";
import { Sparkles, Loader2 } from "lucide-react";

interface AIInsightsProps {
  weatherData: WeatherData;
}

const AIInsights = ({ weatherData }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Using a working API key directly (for demo purposes only)
  // In production, this should be stored securely or fetched from environment variables
  const OPENAI_API_KEY = "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";

  const generateInsights = async () => {
    setLoading(true);
    try {
      const insightsText = await generateWeatherInsights(weatherData, OPENAI_API_KEY);
      setInsights(insightsText);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setInsights("Unable to generate insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Generate insights automatically when weather data changes
  useEffect(() => {
    if (weatherData.current) {
      generateInsights();
    }
  }, [weatherData.current]);

  // Placeholder insights based on weather condition
  const getPlaceholderInsights = () => {
    if (!weatherData.current) return "";
    
    const condition = weatherData.current.condition;
    const temp = weatherData.current.temp;
    
    if (temp > 30) {
      return "• Stay hydrated in this heat\n• Consider indoor activities\n• Use sun protection if going outside";
    } else if (temp < 5) {
      return "• Bundle up with warm layers\n• Watch for icy conditions\n• Indoor heating recommended";
    } else if (condition === "rainy") {
      return "• Take an umbrella when going out\n• Drive carefully on wet roads\n• Waterproof footwear recommended";
    } else if (condition === "cloudy") {
      return "• Good for outdoor activities\n• Light jacket may be needed\n• Pleasant conditions overall";
    } else {
      return "• Perfect weather for outdoor activities\n• Don't forget sun protection\n• Enjoy the pleasant conditions";
    }
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
            {insights || getPlaceholderInsights()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
