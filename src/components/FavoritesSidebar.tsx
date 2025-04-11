'use client';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface FavoriteLocation {
  display_name: string;
  lat: number;
  lon: number;
}

interface FavoritesSidebarProps {
  onLocationSelect: (lat: number, lon: number) => void;
  favorites: FavoriteLocation[];
  setFavorites: (favorites: FavoriteLocation[]) => void;
}

export function FavoritesSidebar({ onLocationSelect, favorites, setFavorites }: FavoritesSidebarProps) {
  const removeFavorite = (index: number) => {
    const newFavorites = [...favorites];
    const removedLocation = newFavorites.splice(index, 1)[0];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(newFavorites));
    toast.success(`Removed ${removedLocation.display_name} from favorites`);
  };

  return (
    <Card className="p-4 w-64 h-[600px] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Favorite Locations</h2>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {favorites.length === 0 ? (
          <p className="text-sm text-gray-500">No favorite locations yet</p>
        ) : (
          favorites.map((favorite, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Button
                variant="ghost"
                className="flex-1 text-left truncate"
                onClick={() => onLocationSelect(favorite.lat, favorite.lon)}
              >
                <span className="truncate">{favorite.display_name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFavorite(index)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
} 