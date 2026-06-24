import type { Metadata, Viewport } from "next";
import { PwaRegistrar } from "@/components/PwaRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tokyo Next Trains",
  description: "現在地から1km以内の駅と次の発車時刻を表示するPWA",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Next Trains",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faf9" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PwaRegistrar />
        {children}
      </body>
    </html>
  );
}
