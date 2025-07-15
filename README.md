# Trip Budget 🧳✈️

An AI-powered travel planning application that helps you create personalized itineraries and manage your travel budget through natural conversation.

## 🌟 Features

- **🤖 AI-Powered Planning**: Get personalized travel recommendations through natural conversation
- **💰 Budget Management**: Automatically track and manage your trip expenses
- **✈️ Flight & Hotel Search**: Discover the best deals with AI-powered recommendations
- **🎯 Interactive Cards**: Organize your travel selections with an intuitive card system
- **💬 Real-time Chat**: Seamless conversation with AI for trip planning
- **📱 Mobile-First Design**: Fully responsive design optimized for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Supabase account (for authentication and real-time features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trip-budget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Tequila Flight API Configuration
   TEQUILA_API_KEY=your_tequila_api_key_here
   TEQUILA_BASE_URL=https://api.tequila.kiwi.com/v2
   
   # Booking.com Accommodation API Configuration (via RapidAPI)
   RAPIDAPI_KEY=your_rapidapi_key_here
   RAPIDAPI_HOST=booking-com15.p.rapidapi.com
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Message Counter System Configuration
   MESSAGE_COUNTER_INITIAL_COUNT=50
   MESSAGE_COUNTER_REFERRAL_BONUS=25
   NEXT_PUBLIC_MESSAGE_COUNTER_REFERRAL_BONUS=25
   
   # Brevo Newsletter Configuration
   BREVO_API_KEY=your_brevo_api_key_here
   ```

4. **Get your API keys**

   - **OpenAI API Key**: Sign up at [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Tequila Flight API Key**: Sign up at [Tequila Kiwi Developers](https://tequila.kiwi.com/developers) for real flight data
   - **RapidAPI Key**: Sign up at [RapidAPI](https://rapidapi.com) and subscribe to the Booking.com API for accommodation data
   - **Supabase**: Create a project at [Supabase](https://supabase.com) and get your project URL and keys
   - **Brevo API Key**: Sign up at [Brevo](https://brevo.com) and get your API key for newsletter functionality

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run test:tequila` - Test Tequila Flight API integration
- `npm run test:booking` - Test Booking.com Accommodation API integration
- `npm run test:accommodation` - Test accommodation transformer functions
- `npm run test:accommodation-integration` - Test full accommodation integration
- `npm run test:validation` - Test validation functions
- `npm run test:chat` - Test chat API integration
- `npm run test:auth` - Test authentication system
- `npm run test:invitation` - Test invitation link system
- `npm run test:newsletter` - Test newsletter integration

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: OpenAI GPT-4
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📁 Project Structure

```
trip-budget/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── chat/           # Chat interface
│   │   └── ...
│   ├── components/         # React components
│   │   ├── chat/          # Chat-related components
│   │   ├── landing/       # Landing page components
│   │   └── ...
│   ├── contexts/          # React contexts
│   └── lib/               # Utility functions and configurations
├── docs/                  # Project documentation
├── public/                # Static assets
└── ...
```

## 🔐 Authentication

The application uses Supabase for authentication with the following features:

- **Protected Routes**: Chat page and API endpoints require authentication
- **Login System**: Email/password authentication (no registration required)
- **Session Management**: Automatic session handling with Supabase
- **Route Protection**: Middleware-based route protection
- **Loading States**: Smooth loading experiences during authentication checks

### Authentication Flow

1. **Unauthenticated Users**: Redirected to login page when accessing protected routes
2. **Login**: Users can sign in with email and password
3. **Protected Access**: After login, users can access the chat interface
4. **Session Persistence**: Sessions are automatically maintained across browser sessions
5. **Logout**: Users can sign out and will be redirected to the home page

### Setting Up Authentication

1. **Create a Supabase Project**:
   - Go to [Supabase](https://supabase.com) and create a new project
   - Get your project URL and anon key from the project settings

2. **Configure Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Create Users**:
   - Use the Supabase dashboard to create user accounts
   - Or use the Supabase CLI to manage users programmatically

4. **Test Authentication**:
   ```bash
   npm run test:auth
   ```

## 🎯 Core Features

### AI Chat Interface
- Natural language trip planning
- Context-aware conversations
- Automatic trip detail extraction
- Structured travel recommendations
- **Real flight data integration** via Tequila API
- **Live pricing and availability** for flights
- **Real accommodation data integration** via Booking.com API
- **Live hotel pricing and availability** for accommodations

### Trip Management
- Create and manage multiple trips
- Track destinations, dates, and budgets
- Organize travel selections in interactive cards

### Real-time Updates
- Live chat functionality
- Instant AI responses
- Collaborative trip planning

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for AI features | Yes |
| `TEQUILA_API_KEY` | Your Tequila Flight API key for real flight data | Yes |
| `TEQUILA_BASE_URL` | Tequila API base URL (https://api.tequila.kiwi.com/v2) | Yes |
| `RAPIDAPI_KEY` | Your RapidAPI key for Booking.com accommodation data | Yes |
| `RAPIDAPI_HOST` | RapidAPI host for Booking.com API (booking-com15.p.rapidapi.com) | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `MESSAGE_COUNTER_INITIAL_COUNT` | Initial message count for new users | No (default: 50) |
| `MESSAGE_COUNTER_REFERRAL_BONUS` | Bonus messages for successful referrals | No (default: 25) |
| `NEXT_PUBLIC_MESSAGE_COUNTER_REFERRAL_BONUS` | Client-side referral bonus display | No (default: 25) |

### API Endpoints

- `POST /api/chat` - Handle chat messages with OpenAI integration, flight search, and accommodation search
- Real-time chat functionality via Supabase subscriptions
- **Flight search integration** via OpenAI Function Calling
- **Accommodation search integration** via OpenAI Function Calling

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Email**: hello@tripbudget.com

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Supabase for the backend infrastructure
- Next.js team for the amazing framework
- All contributors and users of Trip Budget

---

**Happy Traveling! ✈️🌍**

## Server-side Supabase Service Role Usage & RLS

- The file `src/lib/server/trip-service-server.ts` uses the Supabase **service role key** to bypass Row Level Security (RLS) for admin/server-side operations (e.g., API routes).
- **WARNING:** Never import this file or use the service role key in any client-side code. Exposing the service role key to the client is a critical security risk.
- Use the regular trip service (`src/lib/trip-service.ts`) for all client-side and user-authenticated operations.
- This pattern ensures that RLS protects user data, while server-side code can perform necessary admin operations securely.
