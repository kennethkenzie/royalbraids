import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { absoluteUrl, getSiteUrl, seoDefaults } from "@/lib/seo";

const jost = localFont({
  src: [
    {
      path: "../public/fonts/Jost-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Jost-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Jost-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Jost-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Jost-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Jost-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Jost-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Royal Braids Ltd | Premium Braids, Weaves & Hair Essentials",
    template: "%s | Royal Braids Ltd",
  },
  description: seoDefaults.description,
  keywords: [
    "Royal Braids",
    "hair extensions Uganda",
    "hair extensions Kampala",
    "braiding hair Uganda",
    "braiding hair Kampala",
    "premium braids",
    "weaves",
    "closures",
    "closures Uganda",
    "crochet hair",
    "crochet hair Uganda",
    "hair extensions",
    "haircare",
    "hair care products Uganda",
    "beauty supplies",
  ],
  applicationName: "Royal Braids Ltd",
  alternates: {
    canonical: "/",
  },
  category: "beauty",
  openGraph: {
    title: "Royal Braids Ltd | Premium Braids, Weaves & Hair Essentials",
    description: seoDefaults.description,
    url: getSiteUrl(),
    siteName: seoDefaults.siteName,
    images: [
      {
        url: absoluteUrl("/auth-bg.png"),
        alt: "Royal Braids Ltd",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Braids Ltd | Premium Braids, Weaves & Hair Essentials",
    description: seoDefaults.description,
    images: [absoluteUrl("/auth-bg.png")],
  },
  verification: {
    google: "SV8elj7AQ265dnJZT8DXDqv9k433YKjYYTE2Y5Zj8-Y",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import CartDrawer from "./components/CartDrawer";
import ChatBot from "./components/ChatBot";
import ClarityScript from "./components/ClarityScript";
import GoogleAnalytics from "./components/GoogleAnalytics";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings = null;
  try {
    settings = await (prisma as any).siteSettings.findUnique({ where: { id: 1 } });
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Royal Braids Ltd",
    url: getSiteUrl(),
    image: absoluteUrl("/auth-bg.png"),
    email: settings?.contactEmail || "info@royalbraids.ug",
    telephone: settings?.contactPhone || "+256781662904",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
    areaServed: ["Kampala", "Uganda"],
  };

  return (
    <html lang="en">
      <body
        className={`${jost.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <GoogleAnalytics 
          measurementId={
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-4TZ9V0EXCD"
          } 
        />
        <ClarityScript
          projectId={
            process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "w0ftfc1oo3"
          }
        />
        <WishlistProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <ChatBot
              logoUrl={settings?.logoUrl}
              phoneNumber={settings?.contactPhone}
            />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
