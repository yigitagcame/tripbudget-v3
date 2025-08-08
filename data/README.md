# Mock API Data

This directory contains mock data files for the Trip Budget application. All backend logic has been removed and replaced with mock implementations that use this local JSON data.

## Data Files

### `trips.json`
Contains mock trip data with the following structure:
- `trips`: Array of trip objects
- Each trip has: `id`, `user_id`, `name`, `description`, `origin`, `destination`, `departure_date`, `return_date`, `passenger_count`, `created_at`, `updated_at`

### `flights.json`
Contains mock flight search data:
- `search_results`: Array of flight objects with airline, price, duration, etc.
- `popular_routes`: Array of popular flight routes
- `airports`: Array of airport data

### `accommodations.json`
Contains mock hotel/accommodation data:
- `search_results`: Array of hotel objects with name, price, rating, amenities, etc.
- `popular_destinations`: Array of popular travel destinations
- `amenities`: Array of available amenities
- `destinations`: Array of destination data

### `users.json`
Contains mock user data:
- `users`: Array of user objects with profile information and preferences

### `chat.json`
Contains mock chat responses:
- `responses`: Array of AI chat response objects with messages, suggestions, and trip context

## API Endpoints

All API endpoints have been converted to use mock data:

### `/api/v1/trips`
- `GET`: Returns trips for a specific user
- `POST`: Creates a new trip (returns mock data)

### `/api/v1/trips/[tripId]`
- `GET`: Returns a specific trip
- `PUT`: Updates a trip
- `DELETE`: Deletes a trip

### `/api/v1/flights`
- `GET`: Search flights, get popular routes, or search airports

### `/api/v1/accommodations`
- `GET`: Search accommodations, get popular destinations, amenities, or search destinations

### `/api/v1/users`
- `GET`: Returns user data

### `/api/v1/chat`
- `POST`: Returns mock chat responses

### `/api/chat`
- `POST`: Main chat endpoint with mock AI responses

### `/api/contact`
- `POST`: Mock contact form submission

### `/api/newsletter`
- `POST`: Mock newsletter subscription

### `/api/gemini`
- `POST`: Mock Gemini AI responses

### `/api/brevo/add-user`
- `POST`: Mock user addition to Brevo

### `/api/brevo/sync-users`
- `POST`: Mock user sync initiation
- `GET`: Mock sync progress

### `/api/referrals/use`
- `POST`: Mock referral code usage

## Mock Utilities

The mock implementation includes utility functions in `src/lib/utils/mock-data.ts`:
- `loadMockData(filename)`: Loads JSON data from the data directory
- `getRandomItem(array)`: Returns a random item from an array
- `getRandomItems(array, count)`: Returns random items from an array
- `simulateDelay(ms)`: Simulates API delay for realistic behavior

## Features

- **Realistic Delays**: All API calls include simulated delays to mimic real network requests
- **Random Responses**: Chat APIs return random responses from predefined data
- **Error Handling**: Includes proper error responses for invalid requests
- **Data Filtering**: APIs filter data based on query parameters
- **Validation**: Input validation is maintained for all endpoints

## Usage

The frontend application can now work entirely with mock data without requiring any backend services, external APIs, or databases. All authentication has been removed for the mock implementation.
