
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Place, RecommendationFilters } from '@/types/travel';
import { places } from '@/data/places';
import { ChevronLeft, Star } from 'lucide-react';
import { calculateSimilarity, getRecommendations } from '@/utils/recommendationEngine';

interface RecommendationEngineProps {
  selectedPlaces: Place[];
  favorites: Place[];
  onToggleFavorite: (place: Place) => void;
  onBack: () => void;
}

const RecommendationEngine = ({
  selectedPlaces,
  favorites,
  onToggleFavorite,
  onBack,
}: RecommendationEngineProps) => {
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Place[]>([]);
  const [filters, setFilters] = useState<RecommendationFilters>({});

  useEffect(() => {
    const recs = getRecommendations(selectedPlaces, places);
    setRecommendations(recs);
    setFilteredRecommendations(recs);
  }, [selectedPlaces]);

  useEffect(() => {
    let filtered = recommendations;

    if (filters.type) {
      filtered = filtered.filter(place => place.type === filters.type);
    }
    if (filters.region) {
      filtered = filtered.filter(place => place.region === filters.region);
    }
    if (filters.bestSeason) {
      filtered = filtered.filter(place => place.bestSeason === filters.bestSeason);
    }

    setFilteredRecommendations(filtered);
  }, [filters, recommendations]);

  const isFavorite = (place: Place) => {
    return favorites.some(fav => fav.id === place.id);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Your Recommendations</h1>
            <p className="text-gray-600">Based on your preferences</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Your Selections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Your Selections</h2>
          <div className="flex flex-wrap gap-2">
            {selectedPlaces.map(place => (
              <Badge key={place.id} variant="secondary" className="px-3 py-1">
                {place.name}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <h3 className="text-lg font-medium">Filter by:</h3>
            
            <Select value={filters.type || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beach">Beach</SelectItem>
                <SelectItem value="hill-station">Hill Station</SelectItem>
                <SelectItem value="spiritual">Spiritual</SelectItem>
                <SelectItem value="heritage">Heritage</SelectItem>
                <SelectItem value="desert">Desert</SelectItem>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="wildlife">Wildlife</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.region || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
                <SelectItem value="central">Central</SelectItem>
                <SelectItem value="northeast">Northeast</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.bestSeason || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, bestSeason: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Best Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
                <SelectItem value="monsoon">Monsoon</SelectItem>
                <SelectItem value="year-round">Year Round</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleFavorite(place)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite(place) 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${isFavorite(place) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{place.name}</h3>
                    <p className="text-sm opacity-90">{place.state}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{place.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {place.type.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {place.region}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {place.bestSeason}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{place.rating}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-orange-50 hover:border-orange-300"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No recommendations found with the current filters.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationEngine;
