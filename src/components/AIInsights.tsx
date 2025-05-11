
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
  const [openAIKey, setOpenAIKey] = useState<string>(
    localStorage.getItem("openai_api_key") || ""
  );
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!openAIKey);

  const generateInsights = async () => {
    if (!openAIKey) {
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    try {
      const insightsText = await generateWeatherInsights(weatherData, openAIKey);
      setInsights(insightsText);
      setShowKeyInput(false);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setInsights("Unable to generate insights. Please check your API key.");
      setShowKeyInput(true);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", openAIKey);
    generateInsights();
  };

  // Generate insights when weather data changes and we have an API key
  useEffect(() => {
    if (weatherData.current && !insights && openAIKey && !showKeyInput) {
      generateInsights();
    }
  }, [weatherData.current, openAIKey]);

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
        {!showKeyInput && (
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
        )}
      </CardHeader>
      <CardContent>
        {showKeyInput ? (
          <div className="flex flex-col space-y-3">
            <p className="text-sm text-muted-foreground">
              Please enter your OpenAI API key to generate AI weather insights:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 p-2 border rounded"
              />
              <Button onClick={saveApiKey}>Save & Generate</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key will be stored in your browser's local storage.
            </p>
          </div>
        ) : loading ? (
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
