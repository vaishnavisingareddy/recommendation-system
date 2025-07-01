
import { Place } from '@/types/travel';

// TF-IDF implementation for content-based filtering
export function calculateTfIdf(documents: string[]): number[][] {
  const vocab = new Set<string>();
  const docWords = documents.map(doc => {
    const words = doc.toLowerCase().split(/\s+/);
    words.forEach(word => vocab.add(word));
    return words;
  });

  const vocabArray = Array.from(vocab);
  const docCount = documents.length;
  
  // Calculate TF-IDF for each document
  const tfidfMatrix = docWords.map(words => {
    const wordCount = words.length;
    const termFreq = new Map<string, number>();
    
    // Calculate term frequency
    words.forEach(word => {
      termFreq.set(word, (termFreq.get(word) || 0) + 1);
    });

    return vocabArray.map(term => {
      const tf = (termFreq.get(term) || 0) / wordCount;
      
      // Calculate document frequency
      const df = docWords.filter(doc => doc.includes(term)).length;
      const idf = Math.log(docCount / (df + 1));
      
      return tf * idf;
    });
  });

  return tfidfMatrix;
}

// Cosine similarity calculation
export function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (magnitude1 * magnitude2);
}

// Enhanced similarity calculation with weighted factors
export function calculateSimilarity(place1: Place, place2: Place): number {
  // Create feature vectors for both places
  const features1 = [...place1.features, place1.type, place1.region, place1.bestSeason].join(' ');
  const features2 = [...place2.features, place2.type, place2.region, place2.bestSeason].join(' ');
  
  const documents = [features1, features2];
  const tfidfMatrix = calculateTfIdf(documents);
  
  const contentSimilarity = calculateCosineSimilarity(tfidfMatrix[0], tfidfMatrix[1]);
  
  // Additional similarity factors with weights
  let bonusScore = 0;
  
  // Strong bonus for same type (beaches, hill-stations, etc.)
  if (place1.type === place2.type) {
    bonusScore += 0.3;
  }
  
  // Moderate bonus for same region
  if (place1.region === place2.region) {
    bonusScore += 0.15;
  }
  
  // Small bonus for same season
  if (place1.bestSeason === place2.bestSeason) {
    bonusScore += 0.1;
  }
  
  // Bonus for overlapping features
  const commonFeatures = place1.features.filter(f => place2.features.includes(f));
  bonusScore += (commonFeatures.length / Math.max(place1.features.length, place2.features.length)) * 0.2;
  
  return Math.min(contentSimilarity + bonusScore, 1.0);
}

// Get highly relevant recommendations with strict filtering
export function getRecommendations(selectedPlaces: Place[], allPlaces: Place[]): Place[] {
  if (selectedPlaces.length === 0) {
    return allPlaces.slice(0, 10); // Return top 10 if no preferences
  }

  // Filter out already selected places
  const candidatePlaces = allPlaces.filter(
    place => !selectedPlaces.some(selected => selected.id === place.id)
  );

  // Calculate similarity scores for each candidate place
  const recommendations = candidatePlaces.map(candidate => {
    // Calculate maximum similarity with any selected place (not average)
    const similarities = selectedPlaces.map(selected => 
      calculateSimilarity(selected, candidate)
    );
    
    const maxSimilarity = Math.max(...similarities);
    
    // Boost score based on rating (smaller impact)
    const ratingBoost = (candidate.rating - 4.0) / 10; // Only boost if rating > 4.0
    const finalScore = maxSimilarity + Math.max(0, ratingBoost);
    
    return {
      ...candidate,
      similarityScore: finalScore
    };
  });

  // Apply strict similarity threshold - only show highly relevant places
  const SIMILARITY_THRESHOLD = 0.35; // Increased threshold for better relevance
  
  const relevantRecommendations = recommendations.filter(
    place => place.similarityScore >= SIMILARITY_THRESHOLD
  );

  console.log(`Found ${relevantRecommendations.length} relevant recommendations out of ${recommendations.length} candidates`);
  console.log('Top similarities:', relevantRecommendations.slice(0, 5).map(r => ({ name: r.name, score: r.similarityScore.toFixed(3) })));

  // Sort by similarity score and return top recommendations
  return relevantRecommendations
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 12); // Reduced number to focus on quality over quantity
}

// Get similar places based on a single place
export function getSimilarPlaces(targetPlace: Place, allPlaces: Place[], count: number = 5): Place[] {
  const candidatePlaces = allPlaces.filter(place => place.id !== targetPlace.id);
  
  const similarPlaces = candidatePlaces.map(place => ({
    ...place,
    similarityScore: calculateSimilarity(targetPlace, place)
  }));

  const SIMILARITY_THRESHOLD = 0.3;
  
  return similarPlaces
    .filter(place => place.similarityScore >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, count);
}
