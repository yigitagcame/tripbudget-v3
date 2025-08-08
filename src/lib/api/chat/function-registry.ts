// Import all function definitions
import { flightSearchFunction, executeFlightSearch } from './flight-functions';
import { accommodationSearchFunction, executeAccommodationSearch } from './accommodation-functions';
import { 
  cheapestDestinationFunction, 
  packageDealFunction, 
  seasonalPriceAnalysisFunction,
  executeCheapestDestinationSearch,
  executePackageDealSearch,
  executeSeasonalPriceAnalysis
} from './general-functions';

// All function definitions for OpenAI
export const allFunctions = [
  // Flight functions
  'flightSearchFunction',
  
  // Accommodation functions
  'accommodationSearchFunction',
  
  // Creative functions
  'cheapestDestinationFunction',
  'packageDealFunction',
  'seasonalPriceAnalysisFunction'
];

// Function execution mapping
export const functionExecutors: Record<string, (args: any) => Promise<any>> = {
  'search_flights': executeFlightSearch,
  'search_accommodation': executeAccommodationSearch,
  'find_cheapest_destination': executeCheapestDestinationSearch,
  'find_package_deals': executePackageDealSearch,
  'analyze_seasonal_prices': executeSeasonalPriceAnalysis
};

// Export all function definitions as an array
export const functionDefinitions = [
  flightSearchFunction,
  accommodationSearchFunction,
  cheapestDestinationFunction,
  packageDealFunction,
  seasonalPriceAnalysisFunction
];

// Re-export functions for convenience
export {
  flightSearchFunction,
  executeFlightSearch,
  accommodationSearchFunction,
  executeAccommodationSearch,
  cheapestDestinationFunction,
  packageDealFunction,
  seasonalPriceAnalysisFunction,
  executeCheapestDestinationSearch,
  executePackageDealSearch,
  executeSeasonalPriceAnalysis
}; 