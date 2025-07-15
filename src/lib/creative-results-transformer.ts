export interface CheapestDestinationResult {
  destination: string;
  flight: {
    price: number;
    airline: string;
    duration: number;
    departure: string;
    arrival: string;
  };
  accommodation: {
    name: string;
    price: number;
    rating: number;
    total_cost: number;
  };
  totalCost: number;
  dailyCost: number;
}

export interface PackageDealResult {
  flight: {
    price: number;
    airline: string;
    duration: number;
    departure: string;
    arrival: string;
  };
  accommodation: {
    name: string;
    price: number;
    rating: number;
    total_cost: number;
  };
  totalCost: number;
  dailyCost: number;
}

export interface SeasonalAnalysisResult {
  monthlySummary: Array<{
    month: string;
    averageCost: number;
    minCost: number;
    maxCost: number;
    sampleCount: number;
  }>;
  bestMonth: {
    month: string;
    averageCost: number;
  };
  worstMonth: {
    month: string;
    averageCost: number;
  };
}

export function transformCheapestDestinationResults(results: CheapestDestinationResult[], currency: string = 'USD'): Array<{
  type: 'destination';
  title: string;
  description: string;
  price: string;
  rating: number;
  location: string;
  details: {
    flightCost: number;
    accommodationCost: number;
    dailyCost: number;
    rank: number;
  };
}> {
  return results.map((result, index) => ({
    type: 'destination' as const,
    title: `${result.destination} - Best Value`,
    description: `${result.flight.airline} • ${Math.floor(result.flight.duration / 3600)}h ${Math.floor((result.flight.duration % 3600) / 60)}m flight`,
    price: `${currency === 'EUR' ? '€' : '$'}${Math.round(result.totalCost)} total`,
    rating: result.accommodation.rating,
    location: result.destination,
    details: {
      flightCost: result.flight.price,
      accommodationCost: result.accommodation.total_cost,
      dailyCost: result.dailyCost,
      rank: index + 1
    }
  }));
}

export function transformPackageDealResults(results: PackageDealResult[], destination: string, currency: string = 'USD'): Array<{
  type: 'package';
  title: string;
  description: string;
  price: string;
  rating: number;
  location: string;
  details: {
    flightCost: number;
    accommodationCost: number;
    dailyCost: number;
    rank: number;
  };
}> {
  return results.map((result, index) => ({
    type: 'package' as const,
    title: `${destination} Package Deal`,
    description: `${result.flight.airline} • ${result.accommodation.name}`,
    price: `${currency === 'EUR' ? '€' : '$'}${Math.round(result.totalCost)} total`,
    rating: result.accommodation.rating,
    location: destination,
    details: {
      flightCost: result.flight.price,
      accommodationCost: result.accommodation.total_cost,
      dailyCost: result.dailyCost,
      rank: index + 1
    }
  }));
}

export function transformSeasonalAnalysisResults(results: SeasonalAnalysisResult, destination: string, currency: string = 'USD'): Array<{
  type: 'seasonal';
  title: string;
  description: string;
  price: string;
  rating: number;
  location: string;
  details: {
    month: string;
    averageCost: number;
    type: 'best' | 'worst';
  };
}> {
  const cards = [];
  
  // Add best month card
  if (results.bestMonth) {
    cards.push({
      type: 'seasonal' as const,
      title: `Best Time to Visit ${destination}`,
      description: `${results.bestMonth.month} - Average ${currency === 'EUR' ? '€' : '$'}${results.bestMonth.averageCost}`,
      price: `${currency === 'EUR' ? '€' : '$'}${results.bestMonth.averageCost} average`,
      rating: 5.0,
      location: destination,
      details: {
        month: results.bestMonth.month,
        averageCost: results.bestMonth.averageCost,
        type: 'best' as 'best'
      }
    });
  }
  
  // Add worst month card
  if (results.worstMonth) {
    cards.push({
      type: 'seasonal' as const,
      title: `Avoid ${results.worstMonth.month}`,
      description: `Highest prices - Average ${currency === 'EUR' ? '€' : '$'}${results.worstMonth.averageCost}`,
      price: `${currency === 'EUR' ? '€' : '$'}${results.worstMonth.averageCost} average`,
      rating: 2.0,
      location: destination,
      details: {
        month: results.worstMonth.month,
        averageCost: results.worstMonth.averageCost,
        type: 'worst' as 'worst'
      }
    });
  }
  
  return cards;
} 