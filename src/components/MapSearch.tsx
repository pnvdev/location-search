"use client";

import { useState, useEffect, useRef } from "react";
import { Map, Marker } from "pigeon-maps";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { getUserLocation } from "@/app/actions";
import { FavoritesSidebar } from "./FavoritesSidebar";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { WeatherInfo } from "./WeatherInfo";
import { ExtendedForecast } from "./ExtendedForecast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslation } from "@/hooks/useTranslations";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface FavoriteLocation {
  display_name: string;
  lat: number;
  lon: number;
}

export function MapSearch() {
  const { t } = useTranslation();
  
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    0, 0,
  ]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<SearchResult | null>(
    null
  );
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setInitialLocation = async () => {
      try {
        const location = await getUserLocation();
        setMarkerPosition([location.lat, location.lon]);
        setCurrentLocation({
          display_name: location.city.replace(/%20/g, " "),
          lat: location.lat.toString(),
          lon: location.lon.toString(),
        });
      } catch (error) {
        console.error("Error getting location:", error);
        setMarkerPosition([-33.45694, -70.64827]);
        setCurrentLocation({
          display_name: "Santiago, Chile",
          lat: "-33.45694",
          lon: "-70.64827",
        });
      }
    };

    setInitialLocation();
    const savedFavorites = localStorage.getItem("favoriteLocations");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    }
  };

  const debouncedSearch = (query: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setSearchQuery(suggestion.display_name);
    setMarkerPosition([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setCurrentLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    const firstSuggestion = suggestions[0];
    if (firstSuggestion) {
      setMarkerPosition([
        parseFloat(firstSuggestion.lat),
        parseFloat(firstSuggestion.lon),
      ]);
      setCurrentLocation(firstSuggestion);
    }
  };

  const addToFavorites = () => {
    if (!currentLocation) return;

    const newFavorite = {
      display_name: currentLocation.display_name,
      lat: parseFloat(currentLocation.lat),
      lon: parseFloat(currentLocation.lon),
    };

    const isDuplicate = favorites.some(
      (fav) => fav.lat === newFavorite.lat && fav.lon === newFavorite.lon
    );

    if (isDuplicate) {
      toast.error("Location is already in favorites");
      return;
    }

    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteLocations", JSON.stringify(updatedFavorites));
    toast.success("Location added to favorites");
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setMarkerPosition([lat, lon]);
    const selectedFavorite = favorites.find(
      (fav) => fav.lat === lat && fav.lon === lon
    );
    if (selectedFavorite) {
      setCurrentLocation({
        display_name: selectedFavorite.display_name,
        lat: lat.toString(),
        lon: lon.toString(),
      });
      setSearchQuery(selectedFavorite.display_name);
    }
  };

  const removeFavorite = (lat: number, lon: number) => {
    const newFavorites = favorites.filter(
      (fav) => fav.lat !== lat || fav.lon !== lon
    );
    setFavorites(newFavorites);
    localStorage.setItem("favoriteLocations", JSON.stringify(newFavorites));
    toast.success("Location removed from favorites");
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <FavoritesSidebar
          favorites={favorites}
          onLocationSelect={handleLocationSelect}
          onRemoveFavorite={removeFavorite}
        />
        <div className="flex-1">
          <Card className="p-4 gap-4">
            <div className="flex flex-col gap-2 relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() => setShowSuggestions(true)}
                    className="pr-8"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {currentLocation && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addToFavorites}
                    title="Add to favorites"
                    className="cursor-pointer"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px] md:h-[500px] rounded-lg overflow-hidden">
                <Map
                  height={isMobile ? 300 : 500}
                  defaultCenter={markerPosition}
                  defaultZoom={11}
                  center={markerPosition}
                >
                  <Marker width={50} anchor={markerPosition} />
                </Map>
              </div>
              {currentLocation && (
                <div className="h-[100%] md:h-[500px] overflow-y-auto">
                  <WeatherInfo
                    lat={parseFloat(currentLocation.lat)}
                    lon={parseFloat(currentLocation.lon)}
                    displayName={currentLocation.display_name.split(",")[0]}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      {currentLocation && (
        <ExtendedForecast
          lat={parseFloat(currentLocation.lat)}
          lon={parseFloat(currentLocation.lon)}
        />
      )}
    </div>
  );
}
