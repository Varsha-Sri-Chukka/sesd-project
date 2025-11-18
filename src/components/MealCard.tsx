import { useState } from 'react';
import { Heart, MapPin, Tag, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Meal } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MealCardProps {
  meal: Meal;
  isFavorite: boolean;
  onToggleFavorite: (mealId: string) => void;
}

export function MealCard({ meal, isFavorite, onToggleFavorite }: MealCardProps) {
  const [mealDetails, setMealDetails] = useState<Meal | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Generate a mock rating between 4.0 and 5.0
  const rating = (4.0 + Math.random()).toFixed(1);

  const fetchMealDetails = async () => {
    if (mealDetails) return; // Already loaded
    
    setLoadingDetails(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const data = await response.json();
      if (data.meals && data.meals[0]) {
        setMealDetails(data.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching meal details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <ImageWithFallback
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="secondary"
          className={`absolute top-3 right-3 rounded-full shadow-md ${
            isFavorite
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white hover:bg-gray-100'
          }`}
          onClick={() => onToggleFavorite(meal.idMeal)}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-orange-500 text-white shadow-md">
            ⭐ {rating}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {meal.strMeal}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          {meal.strArea && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{meal.strArea}</span>
            </div>
          )}
          {meal.strCategory && (
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{meal.strCategory}</span>
            </div>
          )}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={fetchMealDetails}
            >
              <Info className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{meal.strMeal}</DialogTitle>
              <DialogDescription>
                {meal.strArea} • {meal.strCategory}
              </DialogDescription>
            </DialogHeader>

            {loadingDetails ? (
              <div className="space-y-4">
                <div className="w-full h-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            ) : mealDetails ? (
              <div className="space-y-4">
                <ImageWithFallback
                  src={mealDetails.strMealThumb}
                  alt={mealDetails.strMeal}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white">
                    ⭐ {rating}
                  </Badge>
                  <Badge variant="secondary">{mealDetails.strArea}</Badge>
                  <Badge variant="secondary">{mealDetails.strCategory}</Badge>
                </div>

                {mealDetails.strTags && (
                  <div>
                    <h4 className="text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {mealDetails.strTags.split(',').map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {mealDetails.strInstructions && (
                  <div>
                    <h4 className="text-gray-900 mb-2">Instructions</h4>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {mealDetails.strInstructions}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-gray-900 mb-2">Ingredients</h4>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
                      const ingredient = mealDetails[`strIngredient${i}` as keyof Meal];
                      const measure = mealDetails[`strMeasure${i}` as keyof Meal];
                      if (ingredient && ingredient.trim()) {
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-orange-500">•</span>
                            {measure} {ingredient}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
