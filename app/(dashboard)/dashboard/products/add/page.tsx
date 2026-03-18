import ProductEditorForm from "@/app/components/ProductEditorForm";
import prisma from "@/lib/prisma";

export default async function AddProductPage() {
  const units = await prisma.unit.findMany({
    orderBy: { name: "asc" },
  });

  return <ProductEditorForm mode="create" units={units} />;
}
