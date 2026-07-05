import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceApotheke Dashboard",
  description: "Next-Gen Freelance Pharmacist Platform",
};

import UtmTracker from "@/components/UtmTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col">
        <UtmTracker />
        {children}
      </body>
    </html>
  );
}
