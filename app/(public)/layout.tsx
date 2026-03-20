import FentyHeader from "../components/FentyHeader";
import RoyalBridalsFooter from "../components/RoyalBridalsFooter";
import prisma from "@/lib/prisma";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [topbar, nav, settings] = await Promise.all([
    (prisma as any).topbarMessage.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
    (prisma as any).headerNavItem.findMany({ where: { isVisible: true }, orderBy: { order: "asc" } }),
    (prisma as any).siteSettings.findUnique({ where: { id: 1 } }),
  ]);

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
      <RoyalBridalsFooter />
    </>
  );
}
