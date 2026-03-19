import HeroCarousel from "../components/HeroCarousel";
import CategoryCircles from "../components/CategoryCircles";
import MoodProductsSection from "../components/MoodProductsSection";
import FeaturedCategorySections from "../components/FeaturedCategorySections";
import LatestProductsSection from "../components/LatestProductsSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <HeroCarousel />
      <CategoryCircles />
      <MoodProductsSection />
      <FeaturedCategorySections />
      <LatestProductsSection />
    </main>
  );
}
