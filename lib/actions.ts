"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

type ProductPayload = {
  id?: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number | string;
  category: string;
  colors: Array<{ name: string; hex: string }>;
  variations: Array<{ name: string; value: string }>;
  status?: string;
  image?: string;
};

function buildSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getCategoryId(category: string) {
  const categorySlug = category.toLowerCase().replace(/ /g, "-");

  const categoryRecord = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {},
    create: {
      name: category,
      slug: categorySlug,
    },
  });

  return categoryRecord.id;
}

async function getColorConnections(colors: Array<{ name: string; hex: string }>) {
  return Promise.all(
    colors.map(async (color) => {
      return prisma.color.upsert({
        where: { hex: color.hex },
        update: {
          name: color.name,
        },
        create: {
          name: color.name,
          hex: color.hex,
        },
      });
    })
  );
}

async function saveProduct(payload: ProductPayload, mode: "create" | "update") {
  try {
    const {
      id,
      name,
      description,
      price,
      stock,
      category,
      colors,
      variations,
      status,
      image,
    } = payload;

    const slug = buildSlug(name);
    const categoryId = await getCategoryId(category);
    const colorConnections = await getColorConnections(colors);

    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (
      existingProduct &&
      (mode === "create" || existingProduct.id !== id)
    ) {
      return {
        success: false,
        error: `A product with the name "${name}" already exists. Please choose a different name.`,
      };
    }

    const baseProductData = {
      name,
      slug,
      description,
      priceInCents: parseInt(String(price), 10),
      stock: parseInt(String(stock), 10),
      status: status || "Active",
      image,
      categoryId,
    };

    const product =
      mode === "create"
        ? await prisma.product.create({
            data: {
              ...baseProductData,
              colors: {
                connect: colorConnections.map((color) => ({ id: color.id })),
              },
              variations: {
                create: variations.map((variation) => ({
                  type: variation.name,
                  value: variation.value,
                })),
              },
            },
          })
        : await prisma.product.update({
            where: { id },
            data: {
              ...baseProductData,
              colors: {
                set: colorConnections.map((color) => ({ id: color.id })),
              },
              variations: {
                deleteMany: {},
                create: variations.map((variation) => ({
                  type: variation.name,
                  value: variation.value,
                })),
              },
            },
          });

    revalidatePath("/dashboard/products");
    if (id) {
      revalidatePath(`/dashboard/products/${id}/edit`);
    }
    revalidatePath("/");
    revalidatePath("/products");

    return { success: true, product };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);

    let errorMessage =
      mode === "create"
        ? "Something went wrong while publishing the product."
        : "Something went wrong while updating the product.";

    if (error.code === "P2002") {
      errorMessage = "A product with this name (or slug) already exists.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message.split("\n")[0]}`;
    }

    return { success: false, error: errorMessage };
  }
}

export async function createProduct(formData: ProductPayload) {
  return saveProduct(formData, "create");
}

export async function updateProduct(formData: ProductPayload) {
  return saveProduct(formData, "update");
}

export async function unpublishProduct(id: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        status: "Draft",
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    throw new Error(
      error?.message
        ? `Error: ${error.message.split("\n")[0]}`
        : "Something went wrong while unpublishing the product."
    );
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    throw new Error(
      error?.message
        ? `Error: ${error.message.split("\n")[0]}`
        : "Something went wrong while deleting the product."
    );
  }
}
