import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Royal Braids Ltd",
  description: "Experience the Royal touch with premium braids and textures.",
};

import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import ChatBot from "./components/ChatBot";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await (prisma as any).siteSettings.findUnique({ where: { id: 1 } });

  return (
    <html lang="en">
      <body
        className={`${jost.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <ChatBot logoUrl={settings?.logoUrl} />
        </CartProvider>
      </body>
    </html>
  );
}


