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
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Get your API keys**

   - **OpenAI API Key**: Sign up at [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Tequila Flight API Key**: Sign up at [Tequila Kiwi Developers](https://tequila.kiwi.com/developers) for real flight data
   - **Supabase**: Create a project at [Supabase](https://supabase.com) and get your project URL and keys

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
- `npm run test:validation` - Test validation functions
- `npm run test:chat` - Test chat API integration

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

## 🎯 Core Features

### AI Chat Interface
- Natural language trip planning
- Context-aware conversations
- Automatic trip detail extraction
- Structured travel recommendations
- **Real flight data integration** via Tequila API
- **Live pricing and availability** for flights

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
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |

### API Endpoints

- `POST /api/chat` - Handle chat messages with OpenAI integration and flight search
- Real-time chat functionality via Supabase subscriptions
- **Flight search integration** via OpenAI Function Calling

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
