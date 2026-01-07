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
        {/* Suppress 404 errors for missing files (likely from browser cache) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Suppress 404 errors for missing .fbx files (likely from browser cache)
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                  const url = args[0];
                  if (typeof url === 'string' && (url.includes('.fbx') || url.includes('Talking1') || url.includes('Waving'))) {
                    console.warn('Suppressed fetch for missing .fbx file (likely cached reference):', url);
                    return Promise.reject(new Error('File not found (suppressed)'));
                  }
                  return originalFetch.apply(this, args);
                };
                
                // Catch all errors
                window.addEventListener('error', function(e) {
                  if (e.message && (
                    e.message.includes('Talking1.fbx') ||
                    e.message.includes('Waving.fbx') ||
                    e.message.includes('.fbx') ||
                    e.message.includes('404') ||
                    e.message.includes('Not Found') ||
                    e.message.includes('Could not load')
                  )) {
                    console.warn('Suppressed 404 error (likely cached reference):', e.message);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Catch unhandled promise rejections
                window.addEventListener('unhandledrejection', function(e) {
                  const message = e.reason?.message || e.reason?.toString() || '';
                  if (message.includes('Talking1.fbx') ||
                      message.includes('Waving.fbx') ||
                      message.includes('.fbx') ||
                      message.includes('404') ||
                      message.includes('Not Found') ||
                      message.includes('Could not load')) {
                    console.warn('Suppressed 404 promise rejection (likely cached reference):', message);
                    e.preventDefault();
                    e.stopPropagation();
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

