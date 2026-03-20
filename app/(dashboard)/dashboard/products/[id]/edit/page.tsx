import { notFound } from "next/navigation";
import ProductEditorForm from "@/app/components/ProductEditorForm";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      colors: true,
      category: true,
      variations: true,
    },
  });

  if (!product) {
    notFound();
  }

  const [units, categories, colors] = await Promise.all([
    prisma.unit.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.color.findMany({
      select: { id: true, name: true, hex: true, code: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ProductEditorForm
      mode="edit"
      units={units}
      categories={categories}
      availableColors={colors}
      initialData={{
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: String(product.priceInCents / 100),
        stock: String(product.stock),
        category: product.category.name,
        unit: product.unit,
        status: product.status,
        variations:
          product.variations.length > 0
            ? product.variations.map((variation) => ({
                id: variation.id,
                name: variation.type,
                value: variation.value,
              }))
            : [{ id: 1, name: "Length", value: "24 inch" }],
        selectedColors: product.colors.map((color) => ({
          id: color.id,
          name: color.name,
          hex: color.hex,
          code: color.code,
        })),
        imageUrl: product.image || "",
      }}
    />
  );
}
