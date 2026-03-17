import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n";
import { CartProvider } from "@/lib/cart/CartContext";
import { AIChatButton } from "@/components/ai/AIChatButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunmay - Professional Outdoor Apparel Manufacturer",
  description: "Leading manufacturer of ski jackets, hunting gear, and technical outerwear. MOQ 200 pieces. 20 years experience, 1.5M pieces annual capacity.",
  keywords: "ski jacket manufacturer, hunting gear supplier, outdoor apparel wholesale, technical outerwear, seam sealed jacket, waterproof jacket manufacturer",
  openGraph: {
    title: "Sunmay - Professional Outdoor Apparel Manufacturer",
    description: "Leading manufacturer of ski jackets, hunting gear, and technical outerwear. MOQ 200 pieces.",
    type: "website",
    locale: "en_US",
    siteName: "Sunmay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
            <AIChatButton />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
