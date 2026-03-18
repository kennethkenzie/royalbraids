import HeroCarousel from "../components/HeroCarousel";
import MoodProductsSection from "../components/MoodProductsSection";
import FeaturedCategorySections from "../components/FeaturedCategorySections";
import LatestProductsSection from "../components/LatestProductsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <HeroCarousel />
      <MoodProductsSection />
      <FeaturedCategorySections />
      <LatestProductsSection />
    </main>
  );
}
