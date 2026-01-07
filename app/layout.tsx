import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Shreyas Chate - Conversational AI Engineer",
  description: "Portfolio of Shreyas Chate - Conversational AI Engineer specializing in ServiceNow, LangChain, and agentic workflows",
  keywords: ["Shreyas Chate", "Conversational AI", "ServiceNow", "LangChain", "AI Engineer", "Portfolio"],
  authors: [{ name: "Shreyas Chate" }],
  creator: "Shreyas Chate",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Shreyas Chate - Conversational AI Engineer",
    description: "Portfolio of Shreyas Chate - Conversational AI Engineer specializing in ServiceNow, LangChain, and agentic workflows",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyas Chate - Conversational AI Engineer",
    description: "Portfolio of Shreyas Chate - Conversational AI Engineer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

