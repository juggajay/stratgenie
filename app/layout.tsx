import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster } from "sonner";
import { SEO_CONFIG } from "@/lib/seo/constants";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

// Force dynamic rendering for all pages - required for Convex/Clerk
export const dynamic = "force-dynamic";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: SEO_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // Base URL for resolving relative URLs
  metadataBase: new URL(SEO_CONFIG.siteUrl),

  // Title configuration
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },

  // Description
  description: SEO_CONFIG.defaultDescription,

  // Keywords
  keywords: SEO_CONFIG.defaultKeywords,

  // Author/Creator
  authors: [{ name: SEO_CONFIG.siteName, url: SEO_CONFIG.siteUrl }],
  creator: SEO_CONFIG.siteName,
  publisher: SEO_CONFIG.siteName,

  // Application info
  applicationName: SEO_CONFIG.siteName,
  generator: "Next.js",

  // Format detection (disable auto-detection)
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Icons - generated dynamically via app/icon.tsx and app/apple-icon.tsx

  // OpenGraph (default - can be overridden per page)
  // Note: OG images are generated dynamically via app/opengraph-image.tsx
  openGraph: {
    type: "website",
    locale: SEO_CONFIG.locale,
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
  },

  // Twitter Card
  // Note: Twitter images are generated dynamically via app/twitter-image.tsx
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    creator: SEO_CONFIG.twitterHandle,
  },

  // Robots (default - pages can override)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification
  verification: {
    google: "G_vZ0dEl1i8DWlbp9sF74evuhLJmIAkNH2jwNu-XiFY",
  },

  // Other
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${plusJakartaSans.variable} ${newsreader.variable}`}>
        <body className="antialiased">
          <GoogleAnalytics />
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: 'var(--font-body)',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
