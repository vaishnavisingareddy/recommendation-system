
export interface Place {
  id: number;
  name: string;
  image: string;
  description: string;
  type: 'beach' | 'hill-station' | 'spiritual' | 'heritage' | 'desert' | 'city' | 'wildlife';
  region: 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast';
  bestSeason: 'summer' | 'winter' | 'monsoon' | 'year-round';
  features: string[];
  rating: number;
  state: string;
}

export interface RecommendationFilters {
  type?: string;
  region?: string;
  bestSeason?: string;
}
