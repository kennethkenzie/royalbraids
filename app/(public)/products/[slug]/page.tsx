import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailView from "@/app/components/ProductDetailView";

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

  return <ProductDetailView product={product} />;
}
