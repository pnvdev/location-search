'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Menu, X } from 'lucide-react';

interface FavoriteLocation {
  display_name: string;
  lat: number;
  lon: number;
}

interface FavoritesSidebarProps {
  favorites: FavoriteLocation[];
  onLocationSelect: (lat: number, lon: number) => void;
  onRemoveFavorite: (lat: number, lon: number) => void;
}

export function FavoritesSidebar({ favorites, onLocationSelect, onRemoveFavorite }: FavoritesSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50"
        onClick={() => setIsVisible(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed left-0 top-0 h-full w-64 p-4 z-50 bg-background">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Favorite Locations</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {favorites.map((favorite, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
            onClick={() => onLocationSelect(favorite.lat, favorite.lon)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm truncate flex-1">{favorite.display_name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(favorite.lat, favorite.lon);
              }}
            >
              ×
            </Button>
          </div>
        ))}
        {favorites.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No favorite locations yet
          </p>
        )}
      </div>
    </Card>
  );
} 