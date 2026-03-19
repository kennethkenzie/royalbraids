import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailView from "@/app/components/ProductDetailView";
import RecentlyViewed from "@/app/components/RecentlyViewed";
import ProductHistoryTracker from "@/app/components/ProductHistoryTracker";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      colors: true,
      variations: true,
    },
  });

  if (!product || product.status !== "Active") {
    notFound();
  }

  const [sameCategoryProducts, latestProducts] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "Active",
        id: { not: product.id },
        categoryId: product.categoryId,
      },
      include: {
        category: true,
        colors: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 8,
    }),
    prisma.product.findMany({
      where: {
        status: "Active",
        id: { not: product.id },
      },
      include: {
        category: true,
        colors: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 16,
    }),
  ]);

  const recentProducts = [...sameCategoryProducts, ...latestProducts].filter(
    (item, index, items) =>
      items.findIndex((candidate) => candidate.id === item.id) === index,
  );

  const recentlyViewedItems = recentProducts.map((item) => ({
    id: item.id,
    slug: item.slug,
    image: item.image,
    title: item.name,
    shades:
      item.colors.length > 0
        ? `${item.colors.length} color${item.colors.length === 1 ? "" : "s"}`
        : undefined,
    price: `UGX ${item.priceInCents.toLocaleString()}`,
    tag1: "NEW",
    tag2: item.category.name.toUpperCase(),
  }));

  return (
    <>
      <ProductHistoryTracker productId={product.id} slug={product.slug} />
      <ProductDetailView product={product} />
      <RecentlyViewed
        currentProductId={product.id}
        items={recentlyViewedItems}
      />
    </>
  );
}
