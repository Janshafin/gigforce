import type { Metadata } from "next";
import { Playfair_Display, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAuthWrapper from "@/components/GoogleAuthWrapper";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GigForge | AI Co-Founder for Freelancers",
  description: "Stop losing 15-25 hours a week to admin, proposals, and client hunting. Let your AI co-founder handle it while you focus on the work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="bg-grain" />
        <GoogleAuthWrapper>
          {children}
        </GoogleAuthWrapper>
      </body>
    </html>
  );
}

