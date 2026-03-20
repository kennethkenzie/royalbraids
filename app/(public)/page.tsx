import prisma from "@/lib/prisma";
import HeroCarousel from "../components/HeroCarousel";
import CategoryCircles from "../components/CategoryCircles";
import MoodProductsSection from "../components/MoodProductsSection";
import FeaturedCategorySections from "../components/FeaturedCategorySections";
import LatestProductsSection from "../components/LatestProductsSection";
import ReelsProductCarousel from "../components/ReelsProductCarousel";

export const dynamic = "force-dynamic";

async function getHomeSections() {
  try {
    return await prisma.homeSection.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch home sections:", error);
    // Return default order if DB fails
    return [
      { type: "HeroCarousel" },
      { type: "CategoryCircles" },
      { type: "MoodProducts" },
      { type: "FeaturedCategories" },
      { type: "LatestProducts" },
    ];
  }
}

const componentMap: Record<string, React.ComponentType> = {
  HeroCarousel: HeroCarousel,
  CategoryCircles: CategoryCircles,
  MoodProducts: MoodProductsSection,
  FeaturedCategories: FeaturedCategorySections,
  LatestProducts: LatestProductsSection,
};

export default async function Home() {
  const sections = await getHomeSections();

  return (
    <main className="min-h-screen bg-white text-black">
      {sections.map((section: { type: string }) => {
        const Component = componentMap[section.type];
        if (!Component) return null;
        return <Component key={section.type} />;
      })}
      <ReelsProductCarousel />
    </main>
  );
}
