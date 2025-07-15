# Creative API Usage Implementation Guide

## Overview

This document provides step-by-step instructions for implementing creative API usage features in the AI trip planner. The goal is to enhance the AI's ability to provide intelligent, multi-step travel recommendations that go beyond simple flight and hotel searches.

## MVP Features to Implement

### 1. Cheapest Destination Finder
- Compare multiple destinations for total cost (flight + accommodation)
- Return top 3 cheapest options with cost breakdown

### 2. Package Deal Optimizer
- Find best flight + accommodation combinations
- Balance cost vs. quality based on user preferences

### 3. Seasonal Price Analysis
- Analyze price trends across different dates
- Recommend optimal travel times

## Implementation Plan

### Phase 1: Enhanced Function Definitions

#### Step 1.1: Update OpenAI Functions (`src/lib/openai-functions.ts`)

**Add these new function definitions after the existing ones:**

```typescript
export const cheapestDestinationFunction = {
  type: 'function' as const,
  function: {
    name: 'find_cheapest_destination',
    description: 'Find the cheapest destination by comparing total costs (flight + accommodation) across multiple locations',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        date_from: {
          type: 'string',
          description: 'Departure date range start in dd/mm/yyyy format'
        },
        date_to: {
          type: 'string',
          description: 'Departure date range end in dd/mm/yyyy format'
        },
        return_from: {
          type: 'string',
          description: 'Return flight departure date in dd/mm/yyyy format'
        },
        return_to: {
          type: 'string',
          description: 'Return flight departure date end in dd/mm/yyyy format'
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9,
          default: 1
        },
        duration: {
          type: 'number',
          description: 'Trip duration in days (default: 7)',
          minimum: 1,
          maximum: 30,
          default: 7
        },
        budget: {
          type: 'number',
          description: 'Maximum total budget (optional)',
          minimum: 100
        },
        destinations: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of potential destinations to compare (optional, will use defaults if not provided)',
          default: ['Paris', 'Barcelona', 'Rome', 'Amsterdam', 'Prague', 'Budapest']
        }
      },
      required: ['fly_from', 'date_from', 'date_to']
    }
  }
};

export const packageDealFunction = {
  type: 'function' as const,
  function: {
    name: 'find_package_deal',
    description: 'Find the best combination of flight and accommodation for a given destination and budget',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        destination: {
          type: 'string',
          description: 'Destination name (city, district, landmark, etc.)'
        },
        arrival_date: {
          type: 'string',
          description: 'Check-in date in YYYY-MM-DD format'
        },
        departure_date: {
          type: 'string',
          description: 'Check-out date in YYYY-MM-DD format'
        },
        adults: {
          type: 'number',
          description: 'Number of adult guests (default: 1)',
          minimum: 1,
          maximum: 30,
          default: 1
        },
        budget: {
          type: 'number',
          description: 'Total budget for flight + accommodation (optional)',
          minimum: 100
        },
        flight_priority: {
          type: 'string',
          description: 'Priority for flight selection',
          enum: ['price', 'duration', 'quality'],
          default: 'price'
        },
        accommodation_priority: {
          type: 'string',
          description: 'Priority for accommodation selection',
          enum: ['price', 'quality', 'location'],
          default: 'price'
        }
      },
      required: ['fly_from', 'destination', 'arrival_date', 'departure_date']
    }
  }
};

export const seasonalPriceFunction = {
  type: 'function' as const,
  function: {
    name: 'analyze_seasonal_prices',
    description: 'Analyze flight and accommodation prices across different dates to find the best time to travel',
    parameters: {
      type: 'object',
      properties: {
        fly_from: {
          type: 'string',
          description: 'Departure location (IATA airport code, city code, or country code)'
        },
        fly_to: {
          type: 'string',
          description: 'Destination location (IATA airport code, city code, or country code)'
        },
        start_month: {
          type: 'string',
          description: 'Start month to analyze in YYYY-MM format (e.g., "2024-06")'
        },
        end_month: {
          type: 'string',
          description: 'End month to analyze in YYYY-MM format (e.g., "2024-12")'
        },
        trip_duration: {
          type: 'number',
          description: 'Trip duration in days (default: 7)',
          minimum: 1,
          maximum: 30,
          default: 7
        },
        adults: {
          type: 'number',
          description: 'Number of adult passengers (default: 1)',
          minimum: 1,
          maximum: 9,
          default: 1
        }
      },
      required: ['fly_from', 'fly_to', 'start_month', 'end_month']
    }
  }
};
```

#### Step 1.2: Add Execution Functions

**Add these execution functions after the existing ones:**

```typescript
export async function executeCheapestDestinationSearch(args: any) {
  try {
    const results = [];
    const destinations = args.destinations || ['Paris', 'Barcelona', 'Rome', 'Amsterdam', 'Prague', 'Budapest'];
    
    console.log(`Searching for cheapest destination from ${args.fly_from} to ${destinations.length} destinations`);
    
    // Search each destination
    for (const destination of destinations) {
      try {
        // Step 1: Search for flights
        const flightResults = await searchFlights({
          fly_from: args.fly_from,
          fly_to: destination,
          date_from: args.date_from,
          date_to: args.date_to,
          return_from: args.return_from,
          return_to: args.return_to,
          adults: args.adults || 1,
          sort: 'price',
          limit: 1,
          curr: 'USD'
        });
        
        if (!flightResults.data || flightResults.data.length === 0) {
          console.log(`No flights found for ${destination}`);
          continue;
        }
        
        // Step 2: Search for accommodation
        const accommodationResults = await executeAccommodationSearch({
          destination: destination,
          arrival_date: args.date_from.split('/').reverse().join('-'), // Convert dd/mm/yyyy to yyyy-mm-dd
          departure_date: args.return_from ? args.return_from.split('/').reverse().join('-') : 
                         new Date(new Date(args.date_from.split('/').reverse().join('-')).getTime() + (args.duration || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          adults: args.adults || 1,
          search_type: 'budget'
        });
        
        if (accommodationResults.success && accommodationResults.data && accommodationResults.data.length > 0) {
          const flightCost = flightResults.data[0].price;
          const accommodationCost = accommodationResults.data[0].property.priceBreakdown.grossPrice.value * (args.duration || 7);
          const totalCost = flightCost + accommodationCost;
          
          // Check budget constraint if provided
          if (args.budget && totalCost > args.budget) {
            continue;
          }
          
          results.push({
            destination,
            flight: {
              price: flightCost,
              airline: flightResults.data[0].airlines.join(', '),
              duration: flightResults.data[0].duration.total,
              departure: flightResults.data[0].local_departure,
              arrival: flightResults.data[0].local_arrival
            },
            accommodation: {
              name: accommodationResults.data[0].property.name,
              price: accommodationResults.data[0].property.priceBreakdown.grossPrice.value,
              rating: accommodationResults.data[0].property.reviewScore,
              total_cost: accommodationCost
            },
            totalCost,
            dailyCost: totalCost / (args.duration || 7)
          });
        }
      } catch (error) {
        console.error(`Error searching for ${destination}:`, error);
        continue;
      }
    }
    
    // Sort by total cost and return top 3
    results.sort((a, b) => a.totalCost - b.totalCost);
    const topResults = results.slice(0, 3);
    
    return {
      success: true,
      data: topResults,
      search_type: 'cheapest_destination',
      total_searched: destinations.length,
      found_results: results.length
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function executePackageDealSearch(args: any) {
  try {
    // Step 1: Search for flights
    const flightResults = await searchFlights({
      fly_from: args.fly_from,
      fly_to: args.destination,
      date_from: args.arrival_date.split('-').reverse().join('/'), // Convert yyyy-mm-dd to dd/mm/yyyy
      date_to: args.arrival_date.split('-').reverse().join('/'),
      return_from: args.departure_date.split('-').reverse().join('/'),
      return_to: args.departure_date.split('-').reverse().join('/'),
      adults: args.adults || 1,
      sort: args.flight_priority || 'price',
      limit: 3,
      curr: 'USD'
    });
    
    if (!flightResults.success || !flightResults.data || flightResults.data.length === 0) {
      return {
        success: false,
        error: `No flights found to ${args.destination}`
      };
    }
    
    // Step 2: Search for accommodation
    const accommodationResults = await executeAccommodationSearch({
      destination: args.destination,
      arrival_date: args.arrival_date,
      departure_date: args.departure_date,
      adults: args.adults || 1,
      search_type: args.accommodation_priority === 'quality' ? 'luxury' : 
                   args.accommodation_priority === 'location' ? 'best' : 'budget'
    });
    
    if (!accommodationResults.success || !accommodationResults.data || accommodationResults.data.length === 0) {
      return {
        success: false,
        error: `No accommodation found in ${args.destination}`
      };
    }
    
    // Step 3: Combine and rank packages
    const packages = [];
    const tripDuration = Math.ceil((new Date(args.departure_date).getTime() - new Date(args.arrival_date).getTime()) / (1000 * 60 * 60 * 24));
    
    for (const flight of flightResults.data.slice(0, 2)) { // Top 2 flights
      for (const accommodation of accommodationResults.data.slice(0, 2)) { // Top 2 accommodations
        const flightCost = flight.price;
        const accommodationCost = accommodation.property.priceBreakdown.grossPrice.value * tripDuration;
        const totalCost = flightCost + accommodationCost;
        
        // Check budget constraint if provided
        if (args.budget && totalCost > args.budget) {
          continue;
        }
        
        packages.push({
          flight: {
            price: flightCost,
            airline: flight.airlines.join(', '),
            duration: flight.duration.total,
            departure: flight.local_departure,
            arrival: flight.local_arrival
          },
          accommodation: {
            name: accommodation.property.name,
            price: accommodation.property.priceBreakdown.grossPrice.value,
            rating: accommodation.property.reviewScore,
            total_cost: accommodationCost
          },
          totalCost,
          dailyCost: totalCost / tripDuration
        });
      }
    }
    
    // Sort by total cost
    packages.sort((a, b) => a.totalCost - b.totalCost);
    
    return {
      success: true,
      data: packages.slice(0, 3), // Return top 3 packages
      search_type: 'package_deal',
      destination: args.destination
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function executeSeasonalPriceAnalysis(args: any) {
  try {
    const results = [];
    const startDate = new Date(args.start_month + '-01');
    const endDate = new Date(args.end_month + '-01');
    
    // Generate sample dates for each month
    const sampleDates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Add 2 sample dates per month (beginning and middle)
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthMiddle = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
      
      sampleDates.push(monthStart);
      sampleDates.push(monthMiddle);
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    console.log(`Analyzing prices for ${sampleDates.length} sample dates`);
    
    // Analyze each sample date
    for (const sampleDate of sampleDates) {
      try {
        const dateStr = sampleDate.toISOString().split('T')[0];
        const returnDate = new Date(sampleDate.getTime() + (args.trip_duration || 7) * 24 * 60 * 60 * 1000);
        const returnDateStr = returnDate.toISOString().split('T')[0];
        
        // Search for flights
        const flightResults = await searchFlights({
          fly_from: args.fly_from,
          fly_to: args.fly_to,
          date_from: dateStr.split('-').reverse().join('/'),
          date_to: dateStr.split('-').reverse().join('/'),
          return_from: returnDateStr.split('-').reverse().join('/'),
          return_to: returnDateStr.split('-').reverse().join('/'),
          adults: args.adults || 1,
          sort: 'price',
          limit: 1,
          curr: 'USD'
        });
        
        if (flightResults.data && flightResults.data.length > 0) {
          // Search for accommodation
          const accommodationResults = await executeAccommodationSearch({
            destination: args.fly_to,
            arrival_date: dateStr,
            departure_date: returnDateStr,
            adults: args.adults || 1,
            search_type: 'budget'
          });
          
          if (accommodationResults.success && accommodationResults.data && accommodationResults.data.length > 0) {
            const flightCost = flightResults.data[0].price;
            const accommodationCost = accommodationResults.data[0].property.priceBreakdown.grossPrice.value * (args.trip_duration || 7);
            const totalCost = flightCost + accommodationCost;
            
            results.push({
              date: dateStr,
              month: new Date(dateStr).toLocaleString('default', { month: 'long', year: 'numeric' }),
              flightCost,
              accommodationCost,
              totalCost,
              dailyCost: totalCost / (args.trip_duration || 7)
            });
          }
        }
      } catch (error) {
        console.error(`Error analyzing date ${sampleDate.toISOString().split('T')[0]}:`, error);
        continue;
      }
    }
    
    // Group by month and find averages
    const monthlyAverages = {};
    results.forEach(result => {
      if (!monthlyAverages[result.month]) {
        monthlyAverages[result.month] = [];
      }
      monthlyAverages[result.month].push(result);
    });
    
    const monthlySummary = Object.entries(monthlyAverages).map(([month, data]) => {
      const avgTotalCost = data.reduce((sum, item) => sum + item.totalCost, 0) / data.length;
      const minTotalCost = Math.min(...data.map(item => item.totalCost));
      const maxTotalCost = Math.max(...data.map(item => item.totalCost));
      
      return {
        month,
        averageCost: Math.round(avgTotalCost),
        minCost: Math.round(minTotalCost),
        maxCost: Math.round(maxTotalCost),
        sampleCount: data.length
      };
    });
    
    // Find best and worst months
    monthlySummary.sort((a, b) => a.averageCost - b.averageCost);
    const bestMonth = monthlySummary[0];
    const worstMonth = monthlySummary[monthlySummary.length - 1];
    
    return {
      success: true,
      data: {
        monthlySummary,
        bestMonth,
        worstMonth,
        allResults: results
      },
      search_type: 'seasonal_analysis'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
```

### Phase 2: Update Chat API Route

#### Step 2.1: Import New Functions

**Update the imports in `src/app/api/chat/route.ts`:**

```typescript
import { 
  flightSearchFunction, 
  executeFlightSearch, 
  accommodationSearchFunction, 
  executeAccommodationSearch,
  cheapestDestinationFunction,
  executeCheapestDestinationSearch,
  packageDealFunction,
  executePackageDealSearch,
  seasonalPriceFunction,
  executeSeasonalPriceAnalysis
} from '@/lib/openai-functions';
```

#### Step 2.2: Add New Functions to Tools Array

**Update the OpenAI call to include the new functions:**

```typescript
// Call OpenAI API
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages,
  temperature: 0.7,
  max_tokens: 1500,
  tools: [
    flightSearchFunction, 
    accommodationSearchFunction,
    cheapestDestinationFunction,
    packageDealFunction,
    seasonalPriceFunction
  ],
  tool_choice: "auto",
  response_format: { type: "json_object" }
});
```

#### Step 2.3: Handle New Tool Calls

**Add handling for the new tool calls in the tool processing section:**

```typescript
// Handle tool calls
const responseMessage = completion.choices[0]?.message;
if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
  console.log('API - Processing tool calls:', responseMessage.tool_calls.length);
  
  // Add the assistant message with tool calls to the conversation
  messages.push({
    role: 'assistant' as const,
    content: responseMessage.content || '',
    tool_calls: responseMessage.tool_calls
  });
  
  for (const toolCall of responseMessage.tool_calls) {
    if (toolCall.function.name === 'search_flights') {
      // ... existing flight search code ...
    } else if (toolCall.function.name === 'search_accommodation') {
      // ... existing accommodation search code ...
    } else if (toolCall.function.name === 'find_cheapest_destination') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        console.log('API - Cheapest destination search args:', args);
        
        const results = await executeCheapestDestinationSearch(args);
        console.log('API - Cheapest destination search results:', results.success ? 'Success' : 'Failed');
        
        // Add results to the conversation
        messages.push({
          role: 'tool' as const,
          content: JSON.stringify(results),
          tool_call_id: toolCall.id
        });
      } catch (error) {
        console.error('Error executing cheapest destination search:', error);
        messages.push({
          role: 'tool' as const,
          content: JSON.stringify({
            success: false,
            error: 'Failed to search for cheapest destinations'
          }),
          tool_call_id: toolCall.id
        });
      }
    } else if (toolCall.function.name === 'find_package_deal') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        console.log('API - Package deal search args:', args);
        
        const results = await executePackageDealSearch(args);
        console.log('API - Package deal search results:', results.success ? 'Success' : 'Failed');
        
        // Add results to the conversation
        messages.push({
          role: 'tool' as const,
          content: JSON.stringify(results),
          tool_call_id: toolCall.id
        });
      } catch (error) {
        console.error('Error executing package deal search:', error);
        messages.push({
          role: 'tool' as const,
          content: JSON.stringify({
            success: false,
            error: 'Failed to search for package deals'
          }),
          tool_call_id: toolCall.id
        });
      }
    } else if (toolCall.function.name === 'analyze_seasonal_prices') {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        console.log('API - Seasonal price analysis args:', args);
        
        const results = await executeSeasonalPriceAnalysis(args);
        console.log('API - Seasonal price analysis results:', results.success ? 'Success' : 'Failed');
        
        // Add results to the conversation
        messages.push({
          role: 'tool' as const,
          content: JSON.stringify(results),
          tool_call_id: toolCall.id
        });
      } catch (error) {
        console.error('Error executing seasonal price analysis:', error);
        messages.push({
          role: 'tool' as const,
          content: JSON.stringify({
            success: false,
            error: 'Failed to analyze seasonal prices'
          }),
          tool_call_id: toolCall.id
        });
      }
    }
  }
  
  // ... rest of existing code for final completion ...
}
```

### Phase 3: Update System Prompt

#### Step 3.1: Enhance System Prompt

**Update the SYSTEM_PROMPT in `src/app/api/chat/route.ts`:**

```typescript
const SYSTEM_PROMPT = `You are an AI travel assistant that helps users plan their trips.

CRITICAL: You MUST respond using ONLY a valid JSON object. Do NOT include any text outside the JSON. Do NOT include backticks or markdown.

RESPONSE FORMAT:
{
  "message": "Your conversational response to the user",
  "suggestions": [
    {
      "type": "flight|hotel|restaurant|activity|place|destination",
      "title": "Name",
      "description": "Brief description",
      "price": "Price range",
      "location": "Location"
    }
  ],
  "follow-up message": "Your follow-up question or next step",
  "trip-context": {
    "from": "origin location or empty string",
    "to": "destination or empty string", 
    "departDate": "YYYY-MM-DD or empty string",
    "returnDate": "YYYY-MM-DD or empty string",
    "passengers": 0
  }
}

CURRENCY: Always display prices in the user's preferred currency (EUR for Euro, USD for US Dollar). When making recommendations, consider the currency context and mention prices in the appropriate format.

TRIP CONTEXT:
- CRITICAL: If trip context is provided in the system prompt, you MUST preserve it and only update fields when the user explicitly provides new information
- Extract destination from user messages → update "to" field (only if not already set or user provides new destination)
- Extract origin from user messages → update "from" field (only if not already set or user provides new origin)
- Extract dates from user messages → update "departDate" and "returnDate" (only if not already set or user provides new dates)
- Extract number of travelers → update "passengers" (only if not already set or user provides new passenger count)
- NEVER overwrite existing trip context unless the user explicitly provides new information
- Always use the existing trip context as the foundation for your recommendations

SUGGESTIONS:
- Include suggestions array when user asks about flights, hotels, restaurants, activities, places, or destinations
- Use "destination" type for destination suggestions (cities, countries, regions)
- Leave suggestions empty array [] if no specific recommendations needed

FLIGHT SEARCH:
- Use search_flights function when users ask about flights
- Always use current trip context for searches
- Detect user preferences for flight search type:
  * "cheapest" - when user asks for cheapest, lowest price, budget options
  * "fastest" - when user asks for fastest, quickest, shortest duration
  * "best" - when user asks for best, premium, or doesn't specify (default)
- Limit results to 2 flights per search to avoid overwhelming the user

ACCOMMODATION SEARCH:
- Use search_accommodation function when users ask about hotels, accommodations, places to stay
- Always use current trip context for searches
- Detect user preferences for accommodation search type:
  * "budget" - when user asks for budget, cheap, affordable, low-cost options
  * "luxury" - when user asks for luxury, premium, high-end, 5-star options
  * "best" - when user asks for best, recommended, or doesn't specify (default)
- Limit results to 3 hotels per search to provide good options

CREATIVE SEARCH CAPABILITIES:

1. CHEAPEST DESTINATION SEARCH:
- Use find_cheapest_destination function when users ask:
  * "What's the cheapest place to go?"
  * "Where can I travel on a budget?"
  * "Show me the cheapest destinations"
  * "What's the most affordable place to visit?"
- This function compares multiple destinations for total cost (flight + accommodation)
- Always provide the origin location (fly_from) and travel dates
- The function will return top 3 cheapest destinations with cost breakdown

2. PACKAGE DEAL OPTIMIZATION:
- Use find_package_deal function when users ask:
  * "Find me a complete package to [destination]"
  * "Show me flight and hotel packages"
  * "What's the best deal for [destination]?"
  * "I want a complete trip package"
- This function finds the best flight + accommodation combinations
- Consider user's budget and preferences (price vs. quality vs. location)
- Return top 3 package options with total cost

3. SEASONAL PRICE ANALYSIS:
- Use analyze_seasonal_prices function when users ask:
  * "When is the best time to visit [destination]?"
  * "What's the cheapest time to go to [destination]?"
  * "When should I book for [destination]?"
  * "Show me price trends for [destination]"
- This function analyzes prices across different months
- Provide origin, destination, and date range to analyze
- Return monthly price trends and recommendations

INTENT DETECTION:
- "cheapest place to go" → find_cheapest_destination
- "best time to visit" → analyze_seasonal_prices  
- "complete package" → find_package_deal
- "budget travel" → combine cheapest flights + budget accommodation
- "luxury trip" → combine premium flights + luxury accommodation
- "quick getaway" → focus on shorter duration options
- "family vacation" → consider child-friendly destinations and accommodation

Be helpful, conversational, and always consider the current trip context when making recommendations.
`;
```

### Phase 4: Create Response Transformers

#### Step 4.1: Create Creative Results Transformer

**Create `src/lib/creative-results-transformer.ts`:**

```typescript
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

export function transformCheapestDestinationResults(results: CheapestDestinationResult[], currency: string = 'USD'): any[] {
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

export function transformPackageDealResults(results: PackageDealResult[], destination: string, currency: string = 'USD'): any[] {
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

export function transformSeasonalAnalysisResults(results: SeasonalAnalysisResult, destination: string, currency: string = 'USD'): any[] {
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
        type: 'best'
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
        type: 'worst'
      }
    });
  }
  
  return cards;
}
```

#### Step 4.2: Update Chat Route to Use Transformers

**Add imports and transformer usage in `src/app/api/chat/route.ts`:**

```typescript
import { 
  transformCheapestDestinationResults, 
  transformPackageDealResults, 
  transformSeasonalAnalysisResults 
} from '@/lib/creative-results-transformer';

// In the tool call handling section, add transformer usage:
} else if (toolCall.function.name === 'find_cheapest_destination') {
  try {
    const args = JSON.parse(toolCall.function.arguments);
    console.log('API - Cheapest destination search args:', args);
    
    const results = await executeCheapestDestinationSearch(args);
    console.log('API - Cheapest destination search results:', results.success ? 'Success' : 'Failed');
    
    // Transform results to cards
    if (results.success && results.data) {
      const destinationCards = transformCheapestDestinationResults(results.data, currency);
      // Add cards to response
    }
    
    // Add results to the conversation
    messages.push({
      role: 'tool' as const,
      content: JSON.stringify(results),
      tool_call_id: toolCall.id
    });
  } catch (error) {
    // ... error handling ...
  }
} else if (toolCall.function.name === 'find_package_deal') {
  try {
    const args = JSON.parse(toolCall.function.arguments);
    console.log('API - Package deal search args:', args);
    
    const results = await executePackageDealSearch(args);
    console.log('API - Package deal search results:', results.success ? 'Success' : 'Failed');
    
    // Transform results to cards
    if (results.success && results.data) {
      const packageCards = transformPackageDealResults(results.data, results.destination, currency);
      // Add cards to response
    }
    
    // Add results to the conversation
    messages.push({
      role: 'tool' as const,
      content: JSON.stringify(results),
      tool_call_id: toolCall.id
    });
  } catch (error) {
    // ... error handling ...
  }
} else if (toolCall.function.name === 'analyze_seasonal_prices') {
  try {
    const args = JSON.parse(toolCall.function.arguments);
    console.log('API - Seasonal price analysis args:', args);
    
    const results = await executeSeasonalPriceAnalysis(args);
    console.log('API - Seasonal price analysis results:', results.success ? 'Success' : 'Failed');
    
    // Transform results to cards
    if (results.success && results.data) {
      const seasonalCards = transformSeasonalAnalysisResults(results.data, args.fly_to, currency);
      // Add cards to response
    }
    
    // Add results to the conversation
    messages.push({
      role: 'tool' as const,
      content: JSON.stringify(results),
      tool_call_id: toolCall.id
    });
  } catch (error) {
    // ... error handling ...
  }
}
```

### Phase 5: Testing

#### Step 5.1: Create Test Scripts

**Create `scripts/test-creative-api.ts`:**

```typescript
import { 
  executeCheapestDestinationSearch, 
  executePackageDealSearch, 
  executeSeasonalPriceAnalysis 
} from '../src/lib/openai-functions';

async function testCreativeAPI() {
  console.log('Testing Creative API Features...\n');

  try {
    // Test 1: Cheapest Destination Search
    console.log('1. Testing Cheapest Destination Search...');
    const cheapestResults = await executeCheapestDestinationSearch({
      fly_from: 'LON',
      date_from: '01/08/2025',
      date_to: '03/08/2025',
      return_from: '08/08/2025',
      return_to: '10/08/2025',
      adults: 2,
      duration: 7,
      destinations: ['Paris', 'Barcelona', 'Rome']
    });
    
    console.log('✅ Cheapest destination search:', cheapestResults.success ? 'Success' : 'Failed');
    if (cheapestResults.success && cheapestResults.data) {
      console.log(`Found ${cheapestResults.data.length} destinations`);
      cheapestResults.data.forEach((result, index) => {
        console.log(`${index + 1}. ${result.destination}: $${Math.round(result.totalCost)} total`);
      });
    }
    console.log('');

    // Test 2: Package Deal Search
    console.log('2. Testing Package Deal Search...');
    const packageResults = await executePackageDealSearch({
      fly_from: 'LON',
      destination: 'Paris',
      arrival_date: '2025-08-01',
      departure_date: '2025-08-08',
      adults: 2,
      budget: 1500
    });
    
    console.log('✅ Package deal search:', packageResults.success ? 'Success' : 'Failed');
    if (packageResults.success && packageResults.data) {
      console.log(`Found ${packageResults.data.length} packages`);
      packageResults.data.forEach((result, index) => {
        console.log(`${index + 1}. $${Math.round(result.totalCost)} total`);
      });
    }
    console.log('');

    // Test 3: Seasonal Price Analysis
    console.log('3. Testing Seasonal Price Analysis...');
    const seasonalResults = await executeSeasonalPriceAnalysis({
      fly_from: 'LON',
      fly_to: 'Paris',
      start_month: '2024-06',
      end_month: '2024-12',
      trip_duration: 7,
      adults: 2
    });
    
    console.log('✅ Seasonal price analysis:', seasonalResults.success ? 'Success' : 'Failed');
    if (seasonalResults.success && seasonalResults.data) {
      console.log('Best month:', seasonalResults.data.bestMonth?.month);
      console.log('Worst month:', seasonalResults.data.worstMonth?.month);
    }
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCreativeAPI();
```

#### Step 5.2: Add Test Script to Package.json

**Add to `package.json` scripts section:**

```json
{
  "scripts": {
    "test:creative-api": "tsx scripts/test-creative-api.ts"
  }
}
```

## Implementation Checklist

### Phase 1: Function Definitions ✅
- [ ] Add cheapestDestinationFunction
- [ ] Add packageDealFunction  
- [ ] Add seasonalPriceFunction
- [ ] Add executeCheapestDestinationSearch
- [ ] Add executePackageDealSearch
- [ ] Add executeSeasonalPriceAnalysis

### Phase 2: Chat API Integration ✅
- [ ] Import new functions
- [ ] Add functions to tools array
- [ ] Add tool call handling for new functions
- [ ] Add error handling for new functions

### Phase 3: System Prompt Enhancement ✅
- [ ] Update SYSTEM_PROMPT with creative capabilities
- [ ] Add intent detection instructions
- [ ] Add function usage guidelines

### Phase 4: Response Transformers ✅
- [ ] Create creative-results-transformer.ts
- [ ] Add transformer functions
- [ ] Update chat route to use transformers

### Phase 5: Testing ✅
- [ ] Create test script
- [ ] Add test command to package.json
- [ ] Test all new functions

## Usage Examples

### Cheapest Destination Search
```
User: "What's the cheapest place I can go from London next month?"
AI: Uses find_cheapest_destination function
Response: Shows top 3 cheapest destinations with total cost breakdown
```

### Package Deal Search
```
User: "Find me a complete package to Paris under $1000"
AI: Uses find_package_deal function
Response: Shows top 3 flight + accommodation packages
```

### Seasonal Price Analysis
```
User: "When is the best time to visit Japan?"
AI: Uses analyze_seasonal_prices function
Response: Shows monthly price trends and recommendations
```

## Error Handling

All new functions include:
- Try-catch blocks for API calls
- Graceful fallbacks when APIs fail
- User-friendly error messages
- Logging for debugging

## Performance Considerations

- Limit API calls to essential searches
- Use reasonable limits (top 3 results)
- Implement basic caching if needed
- Monitor API rate limits

## Future Enhancements

After MVP implementation:
- Add more destination options
- Implement advanced filtering
- Add user preference learning
- Create more sophisticated pricing algorithms
- Add alternative route discovery
- Implement last-minute deal finder 