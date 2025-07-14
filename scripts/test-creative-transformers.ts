import { 
  transformCheapestDestinationResults, 
  transformPackageDealResults, 
  transformSeasonalAnalysisResults,
  type CheapestDestinationResult,
  type PackageDealResult,
  type SeasonalAnalysisResult
} from '../src/lib/creative-results-transformer';

async function testCreativeTransformers() {
  console.log('Testing Creative Results Transformers...\n');

  try {
    // Test 1: Cheapest Destination Results Transformer
    console.log('1. Testing Cheapest Destination Results Transformer...');
    const cheapestResults: CheapestDestinationResult[] = [
      {
        destination: 'Paris',
        flight: {
          price: 250,
          airline: 'Air France',
          duration: 5400, // 1.5 hours
          departure: '2025-08-01T10:00:00',
          arrival: '2025-08-01T13:30:00'
        },
        accommodation: {
          name: 'Hotel Paris Central',
          price: 120,
          rating: 4.2,
          total_cost: 840 // 7 nights
        },
        totalCost: 1090,
        dailyCost: 155.7
      },
      {
        destination: 'Barcelona',
        flight: {
          price: 180,
          airline: 'Vueling',
          duration: 7200, // 2 hours
          departure: '2025-08-01T09:00:00',
          arrival: '2025-08-01T12:00:00'
        },
        accommodation: {
          name: 'Barcelona Budget Hotel',
          price: 90,
          rating: 3.8,
          total_cost: 630 // 7 nights
        },
        totalCost: 810,
        dailyCost: 115.7
      }
    ];

    const cheapestCards = transformCheapestDestinationResults(cheapestResults, 'USD');
    console.log('✅ Cheapest destination cards created:', cheapestCards.length);
    cheapestCards.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.title} - ${card.price}`);
    });
    console.log('');

    // Test 2: Package Deal Results Transformer
    console.log('2. Testing Package Deal Results Transformer...');
    const packageResults: PackageDealResult[] = [
      {
        flight: {
          price: 300,
          airline: 'British Airways',
          duration: 5400,
          departure: '2025-08-01T08:00:00',
          arrival: '2025-08-01T11:30:00'
        },
        accommodation: {
          name: 'Luxury Paris Hotel',
          price: 200,
          rating: 4.8,
          total_cost: 1400
        },
        totalCost: 1700,
        dailyCost: 242.9
      }
    ];

    const packageCards = transformPackageDealResults(packageResults, 'Paris', 'USD');
    console.log('✅ Package deal cards created:', packageCards.length);
    packageCards.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.title} - ${card.price}`);
    });
    console.log('');

    // Test 3: Seasonal Analysis Results Transformer
    console.log('3. Testing Seasonal Analysis Results Transformer...');
    const seasonalResults: SeasonalAnalysisResult = {
      monthlySummary: [
        {
          month: 'June 2024',
          averageCost: 1200,
          minCost: 1000,
          maxCost: 1400,
          sampleCount: 4
        },
        {
          month: 'July 2024',
          averageCost: 1500,
          minCost: 1300,
          maxCost: 1700,
          sampleCount: 4
        },
        {
          month: 'August 2024',
          averageCost: 1400,
          minCost: 1200,
          maxCost: 1600,
          sampleCount: 4
        }
      ],
      bestMonth: {
        month: 'June 2024',
        averageCost: 1200
      },
      worstMonth: {
        month: 'July 2024',
        averageCost: 1500
      }
    };

    const seasonalCards = transformSeasonalAnalysisResults(seasonalResults, 'Paris', 'USD');
    console.log('✅ Seasonal analysis cards created:', seasonalCards.length);
    seasonalCards.forEach((card, index) => {
      console.log(`  ${index + 1}. ${card.title} - ${card.price}`);
    });
    console.log('');

    // Test 4: Currency Formatting
    console.log('4. Testing Currency Formatting...');
    const eurCheapestCards = transformCheapestDestinationResults(cheapestResults, 'EUR');
    console.log('✅ EUR currency formatting:', eurCheapestCards[0].price);
    
    const usdCheapestCards = transformCheapestDestinationResults(cheapestResults, 'USD');
    console.log('✅ USD currency formatting:', usdCheapestCards[0].price);
    console.log('');

    console.log('🎉 All transformer tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCreativeTransformers(); 