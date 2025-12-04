import { Metadata } from "next";
import DashboardLayoutClient from "./layout-client";

// Re-export the hooks from the client component
export { useMobileNav, useCapture } from "./layout-client";

export const metadata: Metadata = {
  title: "Dashboard | StrataGenie",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
