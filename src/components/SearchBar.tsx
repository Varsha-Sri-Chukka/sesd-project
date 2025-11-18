import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Search, MapPin, UtensilsCrossed } from 'lucide-react';
import { Badge } from './ui/badge';

interface SearchBarProps {
  onSearch: (searchTerm: string, searchType: 'cuisine' | 'name') => void;
  loading: boolean;
}

const POPULAR_CUISINES = [
  'Italian',
  'Chinese',
  'Indian',
  'Mexican',
  'Japanese',
  'American',
  'French',
  'Thai',
  'British',
  'Greek',
  'Turkish',
  'Vietnamese',
];

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'cuisine' | 'name'>('cuisine');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim(), searchType);
    }
  };

  const handleQuickSearch = (cuisine: string) => {
    setSearchTerm(cuisine);
    onSearch(cuisine, 'cuisine');
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <Tabs
        value={searchType}
        onValueChange={(value) => setSearchType(value as 'cuisine' | 'name')}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="cuisine" className="gap-2">
            <MapPin className="w-4 h-4" />
            By Cuisine
          </TabsTrigger>
          <TabsTrigger value="name" className="gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            By Name
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cuisine" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cuisine-search">Search by Cuisine</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="cuisine-search"
                  type="text"
                  placeholder="e.g., Italian, Chinese, Indian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !searchTerm.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          <div>
            <p className="text-sm text-gray-600 mb-3">Popular Cuisines:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CUISINES.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant="secondary"
                  className="cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  onClick={() => handleQuickSearch(cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="name" className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name-search">Search by Meal Name</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="name-search"
                  type="text"
                  placeholder="e.g., Pizza, Pasta, Chicken..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !searchTerm.trim()}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          <div>
            <p className="text-sm text-gray-600 mb-3">Try searching for:</p>
            <div className="flex flex-wrap gap-2">
              {['Chicken', 'Beef', 'Pasta', 'Rice', 'Soup', 'Cake'].map((term) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                  onClick={() => {
                    setSearchTerm(term);
                    onSearch(term, 'name');
                  }}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
