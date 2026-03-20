import prisma from "@/lib/prisma";
import ReelsProductCarouselClient, { ReelItem } from "./ReelsProductCarouselClient";
import { unstable_noStore as noStore } from "next/cache";

async function getReels(): Promise<ReelItem[]> {
  noStore();
  try {
    // We use a raw query because the generated Prisma Client might not have the 'reel' model yet 
    // due to the EPERM issue during 'prisma generate'.
    const reels = await prisma.$queryRawUnsafe(`
      SELECT * FROM "Reel" ORDER BY "createdAt" DESC
    `) as any[];

    return reels.map(r => ({
      id: r.id,
      video: r.video,
      poster: r.poster,
      productImage: r.productImage,
      title: r.title,
      price: r.price,
      link: r.link
    }));
  } catch (error) {
    console.error("Failed to fetch reels from database:", error);
    return [];
  }
}

export default async function ReelsProductCarousel() {
  const items = await getReels();

  if (items.length === 0) {
    return null;
  }

  return <ReelsProductCarouselClient items={items} />;
}
