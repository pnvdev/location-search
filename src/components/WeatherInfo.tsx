'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

interface WeatherInfoProps {
  lat: number;
  lon: number;
}

export function WeatherInfo({ lat, lon }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Error fetching weather:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Weather</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-12 h-12"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-lg font-medium">{Math.round(weather.main.temp)}°C</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Feels Like</p>
            <p className="text-lg font-medium">{Math.round(weather.main.feels_like)}°C</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="text-lg font-medium">{weather.main.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wind Speed</p>
            <p className="text-lg font-medium">{weather.wind.speed} m/s</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Conditions</p>
          <p className="text-lg font-medium capitalize">{weather.weather[0].description}</p>
        </div>
      </div>
    </Card>
  );
} 