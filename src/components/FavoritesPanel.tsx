import { useState, useEffect } from 'react';
import { MealCard } from './MealCard';
import { Meal } from '../App';
import { HeartOff } from 'lucide-react';

interface FavoritesPanelProps {
  favoriteIds: string[];
  onToggleFavorite: (mealId: string) => void;
}

export function FavoritesPanel({ favoriteIds, onToggleFavorite }: FavoritesPanelProps) {
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteMeals([]);
        return;
      }

      setLoading(true);
      try {
        const meals = await Promise.all(
          favoriteIds.map(async (id) => {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
            );
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
          })
        );
        setFavoriteMeals(meals.filter(Boolean) as Meal[]);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favoriteMeals.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
          <HeartOff className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-gray-700 mb-2">No favorites yet</h3>
        <p className="text-gray-500">
          Start exploring and add your favorite meals by clicking the heart icon!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-gray-700 mb-4">
        Your Favorite Meals ({favoriteMeals.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteMeals.map((meal) => (
          <MealCard
            key={meal.idMeal}
            meal={meal}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
