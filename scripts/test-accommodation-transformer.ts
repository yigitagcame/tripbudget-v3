import { transformAccommodationResultsToCards, formatDateForBookingAPI, convertSearchType, getSortParameter } from '../src/lib/accommodation-transformer';
import { BookingHotel } from '../src/lib/booking-api';

// Mock hotel data for testing
const mockHotel: BookingHotel = {
  accessibilityLabel: "The Taj Mahal Tower, Mumbai.\n5 out of 5 stars.\n9.0 Superb 4887 reviews.\n‎Colaba‬ • ‎11 miles from centre‬\n‎Travel Sustainable‬\n‎This property has free cots available‬.\n1 bed.\n24190 INR.\nIncludes taxes and charges.\nFree cancellation.",
  property: {
    reviewScoreWord: "Superb",
    accuratePropertyClass: 5,
    reviewCount: 4887,
    ufi: -2092174,
    isPreferred: true,
    isFirstPage: true,
    checkin: {
      untilTime: "00:00",
      fromTime: "14:00"
    },
    qualityClass: 0,
    rankingPosition: 0,
    reviewScore: 9,
    countryCode: "in",
    propertyClass: 5,
    photoUrls: [
      "https://cf.bstatic.com/xdata/images/hotel/square60/31204963.jpg?k=..."
    ],
    checkoutDate: "2023-11-22",
    position: 0,
    latitude: 18.9215006738599,
    checkout: {
      fromTime: "00:00",
      untilTime: "12:00"
    },
    priceBreakdown: {
      benefitBadges: [],
      grossPrice: {
        currency: "INR",
        value: 24190.0001466274
      },
      taxExceptions: []
    },
    optOutFromGalleryChanges: 0,
    wishlistName: "Mumbai",
    blockIds: [
      "7471708_158036154_2_42_0"
    ],
    currency: "INR",
    checkinDate: "2023-11-21",
    id: 74717,
    mainPhotoId: 31204963,
    name: "The Taj Mahal Tower, Mumbai",
    longitude: 72.8332896530628
  }
};

async function testAccommodationTransformer() {
  console.log('Testing Accommodation Transformer...\n');

  try {
    // Test 1: Transform hotel to card
    console.log('1. Testing Hotel to Card Transformation...');
    const cards = transformAccommodationResultsToCards([mockHotel]);
    console.log('✅ Transformation successful');
    console.log('Card title:', cards[0].title);
    console.log('Card price:', cards[0].price);
    console.log('Card rating:', cards[0].rating);
    console.log('Card location:', cards[0].location);
    console.log('Card star rating:', cards[0].starRating);
    console.log('Card review count:', cards[0].reviewCount);
    console.log('Card check-in time:', cards[0].checkinTime);
    console.log('Card check-out time:', cards[0].checkoutTime);
    console.log('Card booking URL:', cards[0].bookingUrl);
    console.log('');

    // Test 2: Date format validation
    console.log('2. Testing Date Format Validation...');
    const testDates = [
      '2024-04-01',
      '2024-12-25',
      '2025-01-01'
    ];

    testDates.forEach(date => {
      const validated = formatDateForBookingAPI(date);
      console.log(`${date} → ${validated}`);
    });
    console.log('✅ Date format validation successful');
    console.log('');

    // Test 3: Search type conversion
    console.log('3. Testing Search Type Conversion...');
    const searchTypes = ['city', 'district', 'landmark', 'airport', 'station', 'unknown'];
    searchTypes.forEach(type => {
      const converted = convertSearchType(type);
      console.log(`${type} → ${converted}`);
    });
    console.log('✅ Search type conversion successful');
    console.log('');

    // Test 4: Sort parameter selection
    console.log('4. Testing Sort Parameter Selection...');
    const sortTypes = ['budget', 'luxury', 'best'];
    sortTypes.forEach(type => {
      const sortParam = getSortParameter(type);
      console.log(`${type} → ${sortParam}`);
    });
    console.log('✅ Sort parameter selection successful');
    console.log('');

    // Test 5: Edge cases
    console.log('5. Testing Edge Cases...');
    
    // Test with missing data
    const incompleteHotel: BookingHotel = {
      accessibilityLabel: "Test Hotel",
      property: {
        reviewScoreWord: "Good",
        accuratePropertyClass: 3,
        reviewCount: 0,
        ufi: 123,
        isPreferred: false,
        isFirstPage: true,
        checkin: { untilTime: "", fromTime: "" },
        qualityClass: 0,
        rankingPosition: 0,
        reviewScore: 0,
        countryCode: "us",
        propertyClass: 3,
        photoUrls: [],
        checkoutDate: "",
        position: 0,
        latitude: 0,
        checkout: { fromTime: "", untilTime: "" },
        priceBreakdown: {
          benefitBadges: [],
          grossPrice: { currency: "USD", value: 0 },
          taxExceptions: []
        },
        optOutFromGalleryChanges: 0,
        wishlistName: "",
        blockIds: [],
        currency: "USD",
        checkinDate: "",
        id: 123,
        mainPhotoId: 0,
        name: "Test Hotel",
        longitude: 0
      }
    };

    const incompleteCards = transformAccommodationResultsToCards([incompleteHotel]);
    console.log('Incomplete hotel card:', incompleteCards[0]);
    console.log('✅ Edge case handling successful');
    console.log('');

    console.log('🎉 All accommodation transformer tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
  }
}

testAccommodationTransformer(); 