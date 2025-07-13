# Accommodation API Integration Plan (MVP)

## Overview
This document outlines the simplified MVP implementation for integrating the Booking.com accommodation API via RapidAPI into the trip budget application.

## Environment Variables
```
RAPIDAPI_HOST=booking-com15.p.rapidapi.com
RAPIDAPI_KEY=your_rapidapi_key_here
```

Environment variables are integrated!

## Implementation Plan

### 1. Create Booking API Client (`src/lib/booking-api.ts`)

**Purpose**: Handle API calls to Booking.com via RapidAPI

**Key Features**:
- Two-step search process: destination search + hotel search
- Basic error handling
- TypeScript interfaces for search parameters and responses

**API Endpoints**:
1. **Search Destination**: `/api/v1/hotels/searchDestination`
2. **Search Hotels**: `/api/v1/hotels/searchHotels`

**Step 1: Destination Search Parameters**:
- `query`*: Names of locations, cities, districts, places, countries, counties etc.

**Step 2: Hotel Search Parameters**:
- `dest_id`*: Destination ID from destination search
- `search_type`*: Search type (CITY, DISTRICT, etc.)
- `arrival_date`*: Check-in date (dd.mm.yyyy format)
- `departure_date`*: Check-out date (dd.mm.yyyy format)
- `adults` (optional): Number of adult guests (default: 1)
- `children_age` (optional): Children ages as comma-separated string (e.g., "0,17")
- `room_qty` (optional): Number of rooms (default: 1)
- `page_number` (optional): Page number (default: 1)
- `price_min` (optional): Minimum price filter
- `price_max` (optional): Maximum price filter
- `sort_by` (optional): Sort options
- `currency_code` (optional): Currency code (default: USD)
- `languagecode` (optional): Language code (default: en-us)
- `units` (optional): Distance units (metric/imperial)
- `temperature_unit` (optional): Temperature unit (c/f)
- `location` (optional): Location code

### 2. Create Accommodation Transformer (`src/lib/accommodation-transformer.ts`)

**Purpose**: Transform raw API responses into card format

**Transformations**:
- Hotel name and description from `property.name`
- Price formatting from `priceBreakdown.grossPrice`
- Location information from `accessibilityLabel`
- Rating display from `property.reviewScore` and `property.reviewScoreWord`
- Hotel image from `property.photoUrls[0]`
- Star rating from `property.propertyClass`
- Check-in/check-out times from `property.checkin` and `property.checkout`
- Review count from `property.reviewCount`
- Booking URL generation (to be implemented)

### 3. Extend OpenAI Functions (`src/lib/openai-functions.ts`)

**Add**:
- `accommodationSearchFunction` definition
- `executeAccommodationSearch` function
- Basic parameter validation

**Search Types**:
- `budget`: Lower-priced options (use `price_max` filter)
- `luxury`: Higher-rated options (use `sort_by` for rating)
- `best`: Balanced recommendations (default sorting)

### 4. Update Chat API Route (`src/app/api/chat/route.ts`)

**Changes**:
- Add accommodation function to tools array
- Handle accommodation tool calls
- Integrate with existing conversation flow

### 5. Update System Prompt

**Add to existing prompt**:
- Accommodation search instructions
- Basic context handling for hotel searches

## File Structure

```
src/
├── lib/
│   ├── booking-api.ts          # NEW: Booking.com API client
│   ├── accommodation-transformer.ts  # NEW: Response transformer
│   ├── openai-functions.ts     # MODIFY: Add accommodation functions
│   └── validation.ts           # MODIFY: Add accommodation validation
└── app/api/chat/
    └── route.ts                # MODIFY: Add accommodation tool handling
```

## MVP Features

### Core Functionality
- ✅ Two-step search: destination lookup + hotel search
- ✅ Guest count support (adults, children with ages)
- ✅ Price display with currency
- ✅ Hotel name and basic description
- ✅ Star ratings and review scores
- ✅ Hotel images
- ✅ Check-in/check-out times
- ✅ Review count display
- ✅ Booking link generation (placeholder)

### Search Types
- ✅ Budget search (lower price range)
- ✅ Luxury search (higher ratings)
- ✅ Best search (balanced recommendations)

### Error Handling
- ✅ API rate limiting
- ✅ Invalid location errors
- ✅ No availability errors
- ✅ Network errors

## Limitations (MVP Scope)

### Not Included
- ❌ Advanced filtering (amenities beyond basic)
- ❌ Room type selection
- ❌ Detailed hotel information pages
- ❌ Review system integration
- ❌ Caching mechanism
- ❌ Pagination for large results
- ❌ Price comparison features
- ❌ Booking integration (just display links)

### Future Enhancements
- Advanced search filters
- Hotel details and reviews
- Room type selection
- Price comparison features
- Booking integration
- User preferences and favorites

## Implementation Priority

1. **Phase 1**: Destination search API client
2. **Phase 2**: Hotel search API client
3. **Phase 3**: Response transformation and card generation
4. **Phase 4**: OpenAI function integration
5. **Phase 5**: Chat API route updates
6. **Phase 6**: Testing and error handling

## Testing Strategy

### Test Scripts to Create
- `scripts/test-booking-destination.ts`: Test destination search
- `scripts/test-booking-hotels.ts`: Test hotel search
- `scripts/test-accommodation-transformer.ts`: Test response transformation

### Test Scenarios
- Destination search with various queries
- Hotel search with destination ID
- Search with different guest counts and ages
- Error handling (invalid destination, no results)
- Different search types (budget, luxury, best)
- Date format validation (dd.mm.yyyy)

## Code Quality Standards

### Follow Existing Patterns
- Use same naming conventions as flight API
- Maintain consistent error handling
- Follow TypeScript best practices
- Add JSDoc comments for functions

### Code Structure
- Keep functions simple and focused
- Use proper TypeScript interfaces
- Handle errors gracefully
- Maintain clean separation of concerns

## Success Criteria

### Functional Requirements
- ✅ User can search for destinations by name
- ✅ User can search for hotels using destination ID
- ✅ Search results display in card format
- ✅ Different search types work correctly
- ✅ Error messages are user-friendly
- ✅ Integration with existing chat flow
- ✅ Date format conversion (YYYY-MM-DD to dd.mm.yyyy)

### Technical Requirements
- ✅ Destination search API calls work reliably
- ✅ Hotel search API calls work reliably
- ✅ Response transformation is accurate
- ✅ OpenAI function calling works
- ✅ Error handling is robust
- ✅ Code follows existing patterns
- ✅ Date format conversion works correctly

## Next Steps

1. Review and approve this plan
2. Set up RapidAPI account and get API key
3. Add environment variables
4. Begin implementation following the priority order
5. Test each phase before moving to the next
6. Document any deviations from the plan

## API Response Structure

### Destination Search Response
```json
{
  "status": true,
  "message": "Success",
  "timestamp": 1698310086738,
  "data": [
    {
      "dest_type": "district",
      "cc1": "us",
      "city_name": "New York",
      "label": "Manhattan, New York, New York State, United States",
      "longitude": -73.970894,
      "latitude": 40.776115,
      "type": "di",
      "region": "New York State",
      "city_ufi": 20088325,
      "name": "Manhattan",
      "roundtrip": "GgEwIAAoATICZW46A21hbkAASgBQAA==",
      "country": "United States",
      "image_url": "https://cf.bstatic.com/xdata/images/district/150x150/37931.jpg?k=...",
      "dest_id": "929",
      "nr_hotels": 568,
      "lc": "en",
      "hotels": 568
    }
  ]
}
```

### Hotel Search Response
```json
{
  "status": true,
  "message": "Success",
  "timestamp": 1698331801126,
  "data": {
    "hotels": [
      {
        "accessibilityLabel": "The Taj Mahal Tower, Mumbai.\n5 out of 5 stars.\n9.0 Superb 4887 reviews.\n‎Colaba‬ • ‎11 miles from centre‬\n‎Travel Sustainable‬\n‎This property has free cots available‬.\n1 bed.\n24190 INR.\nIncludes taxes and charges.\nFree cancellation.",
        "property": {
          "reviewScoreWord": "Superb",
          "accuratePropertyClass": 5,
          "reviewCount": 4887,
          "ufi": -2092174,
          "isPreferred": true,
          "isFirstPage": true,
          "checkin": {
            "untilTime": "00:00",
            "fromTime": "14:00"
          },
          "qualityClass": 0,
          "rankingPosition": 0,
          "reviewScore": 9,
          "countryCode": "in",
          "propertyClass": 5,
          "photoUrls": [
            "https://cf.bstatic.com/xdata/images/hotel/square60/31204963.jpg?k=..."
          ],
          "checkoutDate": "2023-11-22",
          "position": 0,
          "latitude": 18.9215006738599,
          "checkout": {
            "fromTime": "00:00",
            "untilTime": "12:00"
          },
          "priceBreakdown": {
            "benefitBadges": [],
            "grossPrice": {
              "currency": "INR",
              "value": 24190.0001466274
            },
            "taxExceptions": []
          },
          "optOutFromGalleryChanges": 0,
          "wishlistName": "Mumbai",
          "blockIds": [
            "7471708_158036154_2_42_0"
          ],
          "currency": "INR",
          "checkinDate": "2023-11-21",
          "id": 74717,
          "mainPhotoId": 31204963,
          "name": "The Taj Mahal Tower, Mumbai",
          "longitude": 72.8332896530628
        }
      }
    ],
    "meta": [
      {
        "title": "393 properties"
      }
    ]
  }
}
```

## Key Data Fields for Transformation

### From Destination Search:
- `dest_id`: Used for hotel search
- `name`: Destination name
- `label`: Full location label
- `type`: Search type (ci=city, di=district, etc.)
- `nr_hotels`: Number of available hotels

### From Hotel Search:
- `property.name`: Hotel name
- `property.reviewScore`: Rating (0-10)
- `property.reviewScoreWord`: Rating description
- `property.reviewCount`: Number of reviews
- `property.propertyClass`: Star rating (1-5)
- `property.photoUrls[0]`: Hotel image
- `priceBreakdown.grossPrice`: Price and currency
- `property.checkin/checkout`: Check-in/out times
- `accessibilityLabel`: Formatted description

## Notes

- This is an MVP implementation focused on core functionality
- Future versions can add more advanced features
- Keep the implementation simple and maintainable
- Follow the existing codebase patterns closely
- Prioritize user experience over feature completeness
- Date format conversion required: YYYY-MM-DD → dd.mm.yyyy
- Two-step process: destination search → hotel search 