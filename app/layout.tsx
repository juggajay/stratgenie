import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster } from "sonner";
import { SEO_CONFIG } from "@/lib/seo/constants";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

// Force dynamic rendering for all pages - required for Convex/Clerk
export const dynamic = "force-dynamic";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
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

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // OpenGraph (default - can be overridden per page)
  openGraph: {
    type: "website",
    locale: SEO_CONFIG.locale,
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SEO_CONFIG.siteName} - AI-Powered Strata Compliance`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    creator: SEO_CONFIG.twitterHandle,
    images: ["/og-image.png"],
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
      <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
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
