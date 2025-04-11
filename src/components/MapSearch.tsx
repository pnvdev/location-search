'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getUserLocation } from '@/app/actions';
import { FavoritesSidebar } from './FavoritesSidebar';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<SearchResult | null>(null);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const setInitialLocation = async () => {
      try {
        const location = await getUserLocation();
        setMarkerPosition([location.lat, location.lon]);
      } catch (error) {
        console.error('Error getting location:', error);
        setMarkerPosition([-33.45694, -70.64827]); // Santiago, Chile
      }
    };

    setInitialLocation();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteLocations');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
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
      setMarkerPosition([parseFloat(firstSuggestion.lat), parseFloat(firstSuggestion.lon)]);
      setCurrentLocation(firstSuggestion);
    }
  };

  const addToFavorites = () => {
    if (!currentLocation) return;
    
    const newFavorite = {
      display_name: currentLocation.display_name,
      lat: parseFloat(currentLocation.lat),
      lon: parseFloat(currentLocation.lon)
    };

    // Check if location is already in favorites
    const isDuplicate = favorites.some(
      (fav) => fav.lat === newFavorite.lat && fav.lon === newFavorite.lon
    );

    if (isDuplicate) {
      toast.error('Location is already in favorites');
      return;
    }

    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
    toast.success('Location added to favorites');
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setMarkerPosition([lat, lon]);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex gap-4">
      <FavoritesSidebar 
        onLocationSelect={handleLocationSelect} 
        favorites={favorites}
        setFavorites={setFavorites}
      />
      <Card className="p-4 flex-1">
        <div className="flex flex-col gap-2 mb-4 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(true)}
              />
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
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
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
        <div className="h-[500px] w-full">
          <Map
            height={500}
            defaultCenter={markerPosition}
            defaultZoom={11}
            center={markerPosition}
          >
            <Marker width={50} anchor={markerPosition} />
          </Map>
        </div>
      </Card>
    </div>
  );
} 