import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { MealCard } from './components/MealCard';
import { FavoritesPanel } from './components/FavoritesPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { toast } from 'sonner@2.0.3';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string;
  strCategory: string;
  strInstructions?: string;
  strTags?: string;
}

export default function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('foodfinder-favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('foodfinder-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchMeals = async (searchTerm: string, searchType: 'cuisine' | 'name') => {
    setLoading(true);
    setSearchPerformed(true);
    try {
      let url = '';
      if (searchType === 'cuisine') {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`;
      } else {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
        toast.success(`Found ${data.meals.length} meals!`);
      } else {
        setMeals([]);
        toast.error('No meals found. Try a different search!');
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Failed to fetch meals. Please try again.');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (mealId: string) => {
    setFavorites(prev => {
      if (prev.includes(mealId)) {
        toast.success('Removed from favorites');
        return prev.filter(id => id !== mealId);
      } else {
        toast.success('Added to favorites!');
        return [...prev, mealId];
      }
    });
  };

  const isFavorite = (mealId: string) => favorites.includes(mealId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <div>
              <h1 className="text-orange-600">FoodFinder</h1>
              <p className="text-gray-600 text-sm">Discover delicious meals from around the world</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="search">Search Meals</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-8">
            {/* Search Section */}
            <SearchBar onSearch={searchMeals} loading={loading} />

            {/* Results Section */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="w-full h-48 bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : meals.length > 0 ? (
              <div>
                <h2 className="text-gray-700 mb-4">
                  Found {meals.length} delicious meals
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.idMeal}
                      meal={meal}
                      isFavorite={isFavorite(meal.idMeal)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            ) : searchPerformed ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-gray-700 mb-2">No meals found</h3>
                <p className="text-gray-500">Try searching for a different cuisine or meal name</p>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🍕</div>
                <h3 className="text-gray-700 mb-2">Start Your Food Journey</h3>
                <p className="text-gray-500">Search for meals by cuisine or name to discover amazing dishes!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <FavoritesPanel
              favoriteIds={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Powered by TheMealDB API • Learning Project</p>
        </div>
      </footer>
    </div>
  );
}
