import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CrossBridge Sound Tech Training — SQ-6",
    template: "%s · CrossBridge Sound Training",
  },
  description:
    "Interactive training for CrossBridge sound technicians on the Allen & Heath SQ-6 digital mixing console.",
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
      </body>
    </html>
  );
}
