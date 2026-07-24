import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceApotheke | Die smarte Freelancer-Plattform",
  description: "Finde flexible Einsätze als Apotheker:in oder sichere dir qualifizierte Vertretungen für deine Apotheke. Einfach, transparent und direkt.",
  openGraph: {
    title: "ServiceApotheke | Die smarte Freelancer-Plattform",
    description: "Finde flexible Einsätze als Apotheker:in oder sichere dir qualifizierte Vertretungen für deine Apotheke.",
    url: "https://serviceapotheke.tech",
    siteName: "ServiceApotheke",
    locale: "de_DE",
    type: "website",
  },
};

import UtmTracker from "@/components/UtmTracker";
import { ToastContainer } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-bone text-ink">
        <UtmTracker />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
