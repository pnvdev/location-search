"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import {
  Loader2,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Thermometer,
  MapPin,
} from "lucide-react";
import Image from "next/image";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
}

interface WeatherInfoProps {
  lat: number;
  lon: number;
  displayName?: string;
}

export function WeatherInfo({ lat, lon, displayName }: WeatherInfoProps) {
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
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError("Failed to load weather data");
        console.error("Error fetching weather:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (isLoading) {
    return (
      <Card className="p-4 h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  if (!weather) return null;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <Card className="p-6 h-full">
      <div className="space-y-1">
        {/* Location Name */}
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold">
            {displayName || weather?.name}
          </h2>
        </div>

        {/* Main Weather Info */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-3xl font-bold">
              {Math.round(weather.main.temp)}°C
            </h3>
            <p className="text-lg text-muted-foreground capitalize">
              {weather.weather[0].description}
            </p>
          </div>
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
            height={112}
            width={112}
            className="w-28 h-28"
          />
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="font-medium">
                  {Math.round(weather.main.temp_max)}°C
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Low</p>
                <p className="font-medium">
                  {Math.round(weather.main.temp_min)}°C
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-medium">{weather.main.humidity}%</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="font-medium">
                  {weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-purple-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="font-medium">{weather.main.pressure} hPa</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="font-medium">{weather.visibility / 1000} km</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Sunrise className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Sunrise</p>
                <p className="font-medium">{formatTime(weather.sys.sunrise)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-muted/50 p-1 py-2 md:p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <Sunset className="w-5 h-5 text-orange-500 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Sunset</p>
                <p className="font-medium">{formatTime(weather.sys.sunset)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
