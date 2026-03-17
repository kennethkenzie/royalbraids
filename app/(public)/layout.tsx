import FentyHeader from "../components/FentyHeader";
import RoyalBridalsFooter from "../components/RoyalBridalsFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FentyHeader />
      {children}
      <RoyalBridalsFooter />
    </>
  );
}
