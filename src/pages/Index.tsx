
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RecommendationEngine from '@/components/RecommendationEngine';
import FavoritesList from '@/components/FavoritesList';
import { Place } from '@/types/travel';
import { places } from '@/data/places';
import { Star } from 'lucide-react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'home' | 'recommendations'>('home');
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [favorites, setFavorites] = useState<Place[]>([]);

  const handlePlaceSelection = (place: Place) => {
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.id === place.id);
      if (exists) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedPlaces.length > 0) {
      setCurrentStep('recommendations');
    }
  };

  const handleBackToHome = () => {
    setCurrentStep('home');
    setSelectedPlaces([]);
  };

  const toggleFavorite = (place: Place) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === place.id);
      if (exists) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const isSelected = (place: Place) => {
    return selectedPlaces.some(p => p.id === place.id);
  };

  if (currentStep === 'recommendations') {
    return (
      <RecommendationEngine
        selectedPlaces={selectedPlaces}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Discover India
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
              Select the places you love and get personalized recommendations for your next adventure
            </p>
            {selectedPlaces.length > 0 && (
              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-4">
                  Selected: {selectedPlaces.length} places
                </p>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  Get My Recommendations
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* All Places Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Choose Your Favorite Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on the places you'd love to visit. We'll recommend similar destinations based on your choices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => handlePlaceSelection(place)}
              >
                <Card 
                  className={`overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isSelected(place) 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-transparent hover:border-orange-300'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Selection indicator */}
                    {isSelected(place) && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white rounded-full p-2">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{place.name}</h3>
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
                      {isSelected(place) && (
                        <Badge className="bg-orange-500 text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <FavoritesList 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </section>
      )}

      {/* Fixed Submit Button */}
      {selectedPlaces.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-full shadow-2xl p-2"
          >
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
            >
              Get Recommendations ({selectedPlaces.length} selected)
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Index;
