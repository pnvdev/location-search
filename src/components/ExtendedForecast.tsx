"use client";

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslations";

interface ForecastData {
  dt: number;
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

interface ExtendedForecastProps {
  lat: number;
  lon: number;
}

export function ExtendedForecast({ lat, lon }: ExtendedForecastProps) {
  const { t } = useTranslation();
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }

        const data = await response.json();
        // Get one forecast per day at 12:00 PM
        const dailyForecasts = data.list
          .filter((item: ForecastData) => {
            const date = new Date(item.dt * 1000);
            return date.getHours() === 12;
          })
          .slice(0, 5); // Get next 5 days
        setForecast(dailyForecasts);
      } catch (err) {
        setError("Failed to load forecast data");
        console.error("Error fetching forecast:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
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

  if (!forecast.length) return null;

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">{t("forecast.title")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          
          const dayName = date.toLocaleDateString(t("page.locale"), {
            weekday: "short",
          });          
          const dayNameUpper = dayName.charAt(0).toUpperCase() + dayName.slice(1);

          return (
            <div
              key={index}
              className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <p className="font-medium">{dayNameUpper}</p>
              <Image
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                width={64}
                height={64}
                className="w-16 h-16"
              />
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {Math.round(day.main.temp)}°C
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {day.weather[0].description}
                </p>
                <div className="flex justify-center gap-2 mt-1 text-sm">
                  <span>{t("weather.humidity").charAt(0)}: {day.main.humidity}%</span>
                  <span>{t("weather.wind").charAt(0)}: {day.wind.speed} m/s</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
