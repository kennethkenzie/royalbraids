import FentyHeader from "../components/FentyHeader";
import RoyalBridalsFooter from "../components/RoyalBridalsFooter";
import ChatBot from "../components/ChatBot";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let topbar: any[] = [];
  let nav: any[] = [];
  let settings: any = null;

  try {
    const [topbarData, navData, settingsData] = await Promise.all([
      (prisma as any).topbarMessage.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
      (prisma as any).headerNavItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
      (prisma as any).siteSettings.findUnique({ where: { id: 1 } }),
    ]);
    topbar = topbarData;
    nav = navData;
    settings = settingsData;
  } catch (error) {
    console.error("Failed to fetch public layout data:", error);
  }

  const promoMessages = topbar.map((m: any) => m.text);
  const navLinks = nav.map((n: any) => ({ name: n.name, href: n.href }));

  return (
    <>
      <FentyHeader 
        promoMessages={promoMessages} 
        navLinks={navLinks} 
        settings={settings} 
      />
      {children}
      <ChatBot
        logoUrl={settings?.logoUrl}
        phoneNumber={settings?.contactPhone}
      />
      <RoyalBridalsFooter />
    </>
  );
}
