import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import AiChatWidget from "@/components/AiChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PropVista AI | Intelligent Booking & Society Hub",
  description: "Next-gen intelligent SaaS platform for property booking and society management. Manage apartments, book flats, and connect with your community seamlessly.",
  keywords: "real estate, property management, apartment booking, society management software, PropVista AI",
  authors: [{ name: "PropVista AI" }],
  openGraph: {
    title: "PropVista AI | Intelligent Booking & Society Hub",
    description: "Next-gen intelligent SaaS platform for property booking and society management.",
    type: "website",
    locale: "en_US",
    url: "https://propvista.ai",
    siteName: "PropVista AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
          </div>
          <AiChatWidget role="customer" />
        </Providers>
      </body>
    </html>
  );
}
