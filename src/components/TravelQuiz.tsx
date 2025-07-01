
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { places } from '@/data/places';
import { Place } from '@/types/travel';
import { ChevronLeft } from 'lucide-react';

interface TravelQuizProps {
  onComplete: (selectedPlaces: Place[]) => void;
  onBack: () => void;
}

const TravelQuiz = ({ onComplete, onBack }: TravelQuizProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [direction, setDirection] = useState(0);

  // Take first 10 places for the quiz
  const quizPlaces = places.slice(0, 10);

  const handleSelect = (place: Place, liked: boolean) => {
    if (liked) {
      setSelectedPlaces(prev => [...prev, place]);
    }
    
    if (currentIndex < quizPlaces.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Quiz complete
      const finalSelection = liked ? [...selectedPlaces, place] : selectedPlaces;
      onComplete(finalSelection);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
      // Remove the current place from selection if it was selected
      const currentPlace = quizPlaces[currentIndex];
      setSelectedPlaces(prev => prev.filter(p => p.id !== currentPlace.id));
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentPlace = quizPlaces[currentIndex];
  const progress = ((currentIndex + 1) / quizPlaces.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-800">Travel Preference Quiz</h1>
            <p className="text-gray-600">Question {currentIndex + 1} of {quizPlaces.length}</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Quiz Card */}
        <div className="relative h-[600px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full max-w-2xl"
            >
              <Card className="overflow-hidden shadow-2xl border-0">
                <div className="relative h-96">
                  <img
                    src={currentPlace.image}
                    alt={currentPlace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-3xl font-bold mb-2">{currentPlace.name}</h2>
                    <p className="text-lg opacity-90">{currentPlace.description}</p>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Does this destination interest you?</h3>
                    <p className="text-gray-600">Help us understand your travel preferences</p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleSelect(currentPlace, false)}
                      variant="outline"
                      size="lg"
                      className="px-8 py-3 text-lg border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
                    >
                      Not Interested
                    </Button>
                    <Button
                      onClick={() => handleSelect(currentPlace, true)}
                      size="lg"
                      className="px-8 py-3 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
                    >
                      Love It!
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="px-6 py-2"
          >
            Previous
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Selected: {selectedPlaces.length} destinations
            </p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default TravelQuiz;
