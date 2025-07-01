
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Place } from '@/types/travel';
import { Star } from 'lucide-react';

interface FavoritesListProps {
  favorites: Place[];
  onToggleFavorite: (place: Place) => void;
}

const FavoritesList = ({ favorites, onToggleFavorite }: FavoritesListProps) => {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Favorites</h2>
        <p className="text-gray-600">Places you've saved for later</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Star className="h-4 w-4 fill-current" />
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
                    Plan Visit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FavoritesList;
