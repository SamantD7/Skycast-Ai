
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AIInsightsPage from "./pages/AIInsightsPage";
import WeatherComparisonPage from "./pages/WeatherComparisonPage";
import HourlyForecastPage from "./pages/HourlyForecastPage";
import WeatherCalendarPage from "./pages/WeatherCalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-insights/:city" element={<AIInsightsPage />} />
          <Route path="/weather-comparison/:city" element={<WeatherComparisonPage />} />
          <Route path="/hourly-forecast/:city" element={<HourlyForecastPage />} />
          <Route path="/weather-calendar/:city" element={<WeatherCalendarPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
