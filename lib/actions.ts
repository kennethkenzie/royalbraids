"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: any) {
  try {
    const { name, description, price, stock, category, colors, variations, status, image } = formData;

    // Basic slug generation
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Ensure category exists or connect
    const categoryRecord = await prisma.category.upsert({
      where: { slug: category.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/ /g, "-"),
      },
    });

    // Handle colors - ensure they exist
    const colorConnections = await Promise.all(
      colors.map(async (c: { name: string; hex: string }) => {
        return await prisma.color.upsert({
          where: { hex: c.hex },
          update: {},
          create: {
            name: c.name,
            hex: c.hex,
          },
        });
      })
    );

    // Check for slug uniqueness before creating
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return { success: false, error: `A product with the name "${name}" already exists. Please choose a different name.` };
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        priceInCents: parseInt(price), 
        stock: parseInt(stock),
        status: status || "Active",
        image,
        categoryId: categoryRecord.id,
        colors: {
          connect: colorConnections.map((c) => ({ id: c.id })),
        },
        variations: {
          create: variations.map((v: { name: string; value: string }) => ({
            type: v.name,
            value: v.value,
          })),
        },
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    
    // Return a more specific error if possible
    let errorMessage = "Something went wrong while publishing the product.";
    if (error.code === 'P2002') {
      errorMessage = "A product with this name (or slug) already exists.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message.split('\n')[0]}`;
    }

    return { success: false, error: errorMessage };
  }
}
