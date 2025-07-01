
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TravelQuiz from '@/components/TravelQuiz';
import RecommendationEngine from '@/components/RecommendationEngine';
import FavoritesList from '@/components/FavoritesList';
import { Place } from '@/types/travel';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'home' | 'quiz' | 'recommendations'>('home');
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [favorites, setFavorites] = useState<Place[]>([]);

  const featuredDestinations = [
    {
      id: 1,
      name: "Goa Beaches",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
      description: "Golden beaches and vibrant nightlife"
    },
    {
      id: 2,
      name: "Kashmir Valley",
      image: "https://images.unsplash.com/photo-1505832018823-50331d70d237?w=800&h=600&fit=crop",
      description: "Paradise on earth with snow-capped mountains"
    },
    {
      id: 3,
      name: "Rajasthan Desert",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
      description: "Royal palaces and golden sand dunes"
    }
  ];

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (places: Place[]) => {
    setSelectedPlaces(places);
    setCurrentStep('recommendations');
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

  if (currentStep === 'quiz') {
    return (
      <TravelQuiz
        onComplete={handleQuizComplete}
        onBack={handleBackToHome}
      />
    );
  }

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&h=1080&fit=crop')"
          }}
        ></div>
        
        <motion.div 
          className="relative z-20 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
            Discover India
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Find your perfect destination with our personalized travel recommendations
          </p>
          <Button 
            onClick={handleStartQuiz}
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
          </Button>
        </motion.div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the most beloved places across incredible India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                      <p className="text-sm opacity-90">{destination.description}</p>
                    </div>
                  </div>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take our quick quiz to get personalized recommendations tailored just for you
            </p>
            <Button 
              onClick={handleStartQuiz}
              size="lg"
              variant="outline"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold border-2 border-white transform hover:scale-105 transition-all duration-300"
            >
              Get My Recommendations
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
