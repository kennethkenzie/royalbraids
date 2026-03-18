import FentyHeader from "../components/FentyHeader";
import RoyalBridalsFooter from "../components/RoyalBridalsFooter";
import ReelsProductCarousel from "../components/ReelsProductCarousel";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FentyHeader />
      {children}
      <ReelsProductCarousel />
      <RoyalBridalsFooter />
    </>
  );
}
