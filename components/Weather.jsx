import axios from "axios";
import { Card } from "./ui/card";
import {
  Loader2,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CircleArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";

const apiKey = "34ceb991c40d39ee3809bdd4b6930663"; // Replace with your actual API key

// Function to fetch weather data
export async function fetchWeatherData(location) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
    );
    const data = response.data;

    // Extract relevant weather data
    const temp = data.main.temp;
    const pressure = data.main.pressure;
    const humidity = data.main.humidity;
    const visibility = data.visibility;
    const weatherCondition = data.weather[0].main.toLowerCase(); // Extract main condition
    const conditions = data.weather[0].description;

    return {
      temp,
      pressure,
      humidity,
      visibility,
      weatherCondition,
      conditions,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null; // Handle error gracefully
  }
}

export function WeatherCard({ weather }) {
  if (!weather) return null;

  const { temp, humidity, visibility, pressure, weatherCondition } = weather;

  const getWeatherIcon = () => {
    switch (weatherCondition) {
      case "clear":
        return <Sun className="h-10 w-10 text-yellow-600" />;
      case "clouds":
        return <Cloud className="h-10 w-10 text-gray-400" />;
      case "rain":
        return <CloudRain className="h-10 w-10 text-blue-400" />;
      case "night":
        return <Moon className="h-10 w-10 text-gray-600" />;
      default:
        return <Cloud className="h-10 w-10 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="relative items-start flex flex-col backdrop-blur-sm p-6 rounded-3xl bg-gradient-to-tr from-cyan-200 to-violet-300 bg-opacity-20 dark:from-zinc-800 dark:to-gray-700 dark:bg-opacity-60 shadow-lg text-black dark:text-white">
        <div className="flex flex-col gap-4">
          {/* City and Temperature */}
          <div className="flex flex-col gap-2 items-start justify-between">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Pakistan
            </p>
            <div className="flex items-start gap-2">
              {getWeatherIcon()}
              <p className="text-5xl font-bold">{Math.round(temp)}&deg;</p>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Humidity: {Math.round(humidity)}%
          </p>

          {/* Bottom Bar with Visibility and Pressure */}
          <Card className="flex justify-between items-center rounded-xl gap-2 divide-x-2 divide-gray-700 bg-zinc-200 dark:bg-zinc-800 bg-opacity-50 px-4 py-2 mt-4">
            <div className="flex items-center gap-1 px-1 text-yellow-500">
              <CircleArrowUp className="h-5 w-5" />
              <span className="text-sm">
                {Math.round(visibility / 1000)} km
              </span>
            </div>
            <div className="flex items-center gap-1 px-1 text-emerald-400">
              <CircleArrowUp className="h-5 w-5 rotate-180" />
              <span className="text-sm">{Math.round(pressure)} hPa</span>
            </div>
          </Card>
        </div>
      </Card>
    </motion.div>
  );
}
