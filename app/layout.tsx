import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster } from "sonner";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "StrataGenie | AI-Powered Strata Compliance Copilot for NSW",
    template: "%s | StrataGenie",
  },
  description:
    "Stay compliant, avoid penalties, and simplify strata admin. StrataGenie tracks every AGM, notice period, Strata Hub deadline, and bylaw — so your committee never misses a requirement.",
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
