
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/apiWeather";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ForecastWeather } from "@/lib/apiWeather";

interface WeatherChartProps {
  forecast: ForecastWeather[];
  type: "temperature" | "humidity" | "precipitation";
}

const WeatherChart = ({ forecast, type }: WeatherChartProps) => {
  // Filter forecast to next 24 hours (assuming 3-hour intervals)
  const next24Hours = forecast.slice(0, 8);
  
  // Transform data for the chart
  const chartData = next24Hours.map((item) => {
    return {
      time: formatDateTime(item.dt, "time"),
      temperature: Math.round(item.temp),
      humidity: item.humidity,
      precipitation: Math.round(item.pop * 100),
    };
  });

  // Chart configuration based on type
  const chartConfig = {
    temperature: {
      title: "Temperature Trend",
      dataKey: "temperature",
      stroke: "#e11d48",
      unit: "°C",
      gradientStart: "#fee2e2",
      gradientEnd: "#ef444422",
    },
    humidity: {
      title: "Humidity Trend",
      dataKey: "humidity",
      stroke: "#06b6d4",
      unit: "%",
      gradientStart: "#cffafe",
      gradientEnd: "#22d3ee22",
    },
    precipitation: {
      title: "Precipitation Chance",
      dataKey: "precipitation",
      stroke: "#0284c7",
      unit: "%",
      gradientStart: "#bae6fd",
      gradientEnd: "#38bdf822",
    },
  };

  const config = chartConfig[type];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-[${config.stroke}]">{`${config.title.split(" ")[0]}: ${
            payload[0].value
          } ${config.unit}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="weather-card glass-card">
      <CardHeader>
        <CardTitle className="text-xl">{config.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
            >
              <defs>
                <linearGradient
                  id={`chart-gradient-${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.gradientStart}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.gradientEnd}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                domain={type === "temperature" ? ["dataMin - 5", "dataMax + 5"] : [0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.stroke}
                strokeWidth={3}
                dot={{ r: 4, fill: config.stroke }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                fillOpacity={1}
                fill={`url(#chart-gradient-${type})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChart;
