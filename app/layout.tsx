import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LavishOverlay } from "@/components/LavishOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CrossBridge Training Center",
    template: "%s · CrossBridge Training",
  },
  description:
    "The home for every CrossBridge volunteer training program — sound tech, physical security, Bible teaching, and more. Learn your role at your own pace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-bg font-serif text-brand-text antialiased">
        {children}
        <LavishOverlay />
        <SpeedInsights />
      </body>
    </html>
  );
}
