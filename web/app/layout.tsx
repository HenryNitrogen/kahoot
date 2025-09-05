import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/useLanguage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KQH - Kahoot Quiz Helper | Boost Your Quiz Performance",
  description: "The ultimate companion for Kahoot quizzes. Get intelligent answer suggestions, real-time analysis, and boost your performance with KQH.",
  keywords: "Kahoot, quiz, helper, assistant, education, learning, performance, answers, KQH",
  authors: [{ name: "KQH Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "KQH - Kahoot Quiz Helper",
    description: "Boost your Kahoot performance with intelligent answer suggestions and real-time analysis.",
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "KQH - Kahoot Quiz Helper",
    description: "Boost your Kahoot performance with intelligent answer suggestions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
