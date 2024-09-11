import axios from 'axios';
import { Card} from "./ui/card"
import {Loader2, Sun, Moon, Cloud, CloudRain, CircleArrowUp} from "lucide-react"
import { motion } from 'framer-motion';

const apiKey = '34ceb991c40d39ee3809bdd4b6930663'; // Replace with your actual API key

// Function to fetch weather data
export async function fetchWeatherData(location) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
        const data = response.data;

        // Extract relevant weather data
        const temp = data.main.temp;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const visibility = data.visibility;
        const weatherCondition = data.weather[0].main.toLowerCase(); // Extract main condition
        const conditions = data.weather[0].description;

        return { temp, pressure, humidity, visibility, weatherCondition, conditions };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null; // Handle error gracefully
    }
}

export  function WeatherCard({ weather }) {
    if (!weather) return null;

    const { temp, humidity, visibility, pressure, weatherCondition } = weather;

    const getWeatherIcon = () => {
        switch (weatherCondition) {
            case 'clear':
                return <Sun className="h-10 w-10" />;
            case 'clouds':
                return <Cloud className="h-10 w-10" />;
            case 'rain':
                return <CloudRain className="h-10 w-10" />;
            case 'night':
                return <Moon className="h-10 w-10" />;
            default:
                return <Cloud className="h-10 w-10" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <Card className="relative backdrop-blur flex size-60 flex-col rounded-3xl bg-opacity-10 bg-gradient-to-r from-zinc-200 to-gray-300 bg-clip-padding p-4 dark:text-white text-black backdrop-filter dark:from-zinc-800 dark:to-gray-600">
                <div className="flex flex-1 flex-col gap-2 ">
                    <p className="city opacity-70">Pakistan</p>
                    <div className="flex items-center">
                        {getWeatherIcon()}
                        <p className="text-5xl font-black">{Math.round(temp)}&deg;</p>
                    </div>
                    <p className="feels-like opacity-70">Humidity {Math.round(humidity)}%</p>
                </div>
                <Card className="flex backdrop-blur border-0 justify-between rounded-xl bg-clip-padding py-1 backdrop-blur-lg backdrop-filter bg-zinc-500/50 dark:bg-zinc-700/50">
                    <div className="flex items-center gap-1 px-2 text-orange-200">
                        <CircleArrowUp className="h-5 w-5" />
                        {Math.round(visibility / 1000)} km
                    </div>
                    <p className="text-black dark:text-white opacity-50">|</p>
                    <div className="flex items-center gap-1 px-3 text-green-400">
                        <CircleArrowUp className="h-5 w-5 rotate-180" />
                        {Math.round(pressure)} hPa
                    </div>
                </Card>
            </Card>
        </motion.div>
    );
}
