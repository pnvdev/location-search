'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, Marker } from 'pigeon-maps';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { getUserLocation } from '@/app/actions';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function MapSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    const firstSuggestion = suggestions[0];
    if (firstSuggestion) {
      setMarkerPosition([parseFloat(firstSuggestion.lat), parseFloat(firstSuggestion.lon)]);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <Card className="p-4">
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
  );
} 