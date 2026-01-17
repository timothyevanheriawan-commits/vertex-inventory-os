import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from 'sonner'; 
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// --- UPDATED METADATA ---
export const metadata: Metadata = {
  title: {
    template: "%s | Vertex",
    default: "Vertex | Inventory Intelligence OS",
  },
  description: "Operational intelligence and forecasting for modern retailers.",
  metadataBase: new URL("http://localhost:3000"), // Update this when you deploy
  icons: {
    icon: "/icon.svg",      // The logo for browser tabs
    shortcut: "/icon.svg",  // For bookmarks
    apple: "/icon.svg",     // For iOS home screen
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
        {children}
        {/* 2. Add the Toaster here, at the very bottom of the body */}
        <Toaster position="top-right" richColors expand={false} />
      </body>
    </html>
  );
}