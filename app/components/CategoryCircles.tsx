import prisma from "@/lib/prisma";
import PremiumCategoryCirclesClient from "./PremiumCategoryCirclesClient";

export default async function CategoryCircles() {
  let categories: any[] = [];
  try {
    // Using $queryRaw to bypass the Prisma Client's outdated schema
    // and fetch the new circleImage column directly from the database.
    const dbCategories = (await prisma.$queryRaw`
      SELECT id, name, slug, "circleImage", "isFeatured" 
      FROM "Category" 
      WHERE "isFeatured" = true AND "circleImage" IS NOT NULL
      LIMIT 4
    `) as any[];

    if (dbCategories.length > 0) {
      categories = dbCategories.map((cat) => ({
        ...cat,
        circleImage: cat.circleImage || cat.circleimage, // Handle potential case differences
      }));
    }
  } catch (error) {
    console.warn(
      "Prisma QueryRaw: Failed to fetch categories. This is likely because the migration hasn't been run yet.",
      error
    );
  }

  const staticCategories = [
    {
      id: 1,
      name: "Braids",
      circleImage: "/images/categories/braids.png",
      slug: "braids",
      accent: "#b565c0",
    },
    {
      id: 2,
      name: "Crochet",
      circleImage: "/images/categories/crochet.png",
      slug: "crochet",
      accent: "#aa5ab3",
    },
    {
      id: 3,
      name: "Twists",
      circleImage: "/images/categories/closure.png",
      slug: "twists",
      accent: "#9f53aa",
    },
    {
      id: 4,
      name: "Weaves",
      circleImage: "/images/categories/weaves.png",
      slug: "weaves",
      accent: "#a85ab4",
    },
  ];

  const finalCategories = categories.length > 0 ? categories : staticCategories;

  return <PremiumCategoryCirclesClient categories={finalCategories} />;
}
