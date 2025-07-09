import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Trip Budget',
  description: 'Learn more about FreshBeautyTech OU, the company behind Trip Budget. Our mission is to revolutionize travel planning with AI-powered solutions.',
  keywords: 'about us, company information, FreshBeautyTech OU, Trip Budget, travel technology',
  openGraph: {
    title: 'About Us - Trip Budget',
    description: 'Learn more about FreshBeautyTech OU, the company behind Trip Budget.',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 