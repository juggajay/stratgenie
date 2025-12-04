import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | StrataGenie",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
