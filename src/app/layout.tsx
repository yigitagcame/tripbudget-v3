import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { MessageCounterProvider } from "@/contexts/MessageCounterContext";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trip Budget App",
  description: "Manage your travel expenses with Supabase authentication and database",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <MessageCounterProvider>
            <ToastProvider>
              <Navbar />
              {children}
            </ToastProvider>
          </MessageCounterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
