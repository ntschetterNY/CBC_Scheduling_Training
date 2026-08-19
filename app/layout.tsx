import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ActivityTracker } from "@/components/ActivityTracker";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the theme before first paint: stored override wins, else
            follow the OS. Kept inline so there is no light-mode flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-brand-bg font-serif text-brand-text antialiased">
        {children}
        <ActivityTracker />
        <LavishOverlay />
        <SpeedInsights />
      </body>
    </html>
  );
}
