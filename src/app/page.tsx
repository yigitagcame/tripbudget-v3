import { Metadata } from 'next';
import HeroSection from '@/components/landing/HeroSection';
import PlatformsSection from '@/components/landing/PlatformsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Trip Budget - AI-Powered Trip Planning & Budget Management',
  description: 'Plan your dream trip with AI-powered budgeting. Create personalized itineraries, manage your budget in real-time, and travel smarter with Trip Budget.',
  keywords: 'trip planning, budget management, AI travel, vacation planner, travel budget, itinerary planning',
  openGraph: {
    title: 'Trip Budget - AI-Powered Trip Planning',
    description: 'Plan your dream trip with AI-powered budgeting and smart expense tracking.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen pt-16">
      <HeroSection />
      <PlatformsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
