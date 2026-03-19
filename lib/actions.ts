"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: any) {
  try {
    const { name, description, price, stock, category, unit, colors, variations, status, image } = formData;

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
        unit: unit || "Piece",
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
    
    let errorMessage = "Something went wrong while publishing the product.";
    if (error.code === 'P2002') {
      errorMessage = "A product with this name (or slug) already exists.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message.split('\n')[0]}`;
    }

    return { success: false, error: errorMessage };
  }
}

export async function updateProduct(formData: any) {
  try {
    const {
      id,
      name,
      description,
      price,
      stock,
      category,
      unit,
      colors,
      variations,
      status,
      image,
    } = formData;

    if (!id) {
      return { success: false, error: "Product id is required." };
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const categoryRecord = await prisma.category.upsert({
      where: { slug: category.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: {
        name: category,
        slug: category.toLowerCase().replace(/ /g, "-"),
      },
    });

    const colorConnections = await Promise.all(
      colors.map(async (c: { name: string; hex: string }) => {
        return prisma.color.upsert({
          where: { hex: c.hex },
          update: {
            name: c.name,
          },
          create: {
            name: c.name,
            hex: c.hex,
          },
        });
      })
    );

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct && existingProduct.id !== id) {
      return {
        success: false,
        error: `A product with the name "${name}" already exists. Please choose a different name.`,
      };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        priceInCents: parseInt(price),
        stock: parseInt(stock),
        unit: unit || "Piece",
        status: status || "Active",
        image,
        categoryId: categoryRecord.id,
        colors: {
          set: colorConnections.map((c) => ({ id: c.id })),
        },
        variations: {
          deleteMany: {},
          create: variations.map((v: { name: string; value: string }) => ({
            type: v.name,
            value: v.value,
          })),
        },
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);

    let errorMessage = "Something went wrong while updating the product.";
    if (error.code === "P2002") {
      errorMessage = "A product with this name (or slug) already exists.";
    } else if (error.message) {
      errorMessage = `Error: ${error.message.split("\n")[0]}`;
    }

    return { success: false, error: errorMessage };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/dashboard/products");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete product.");
  }
}

export async function unpublishProduct(id: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { status: "Draft" },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/inventory");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to unpublish product.");
  }
}

export async function publishProduct(id: number) {
  try {
    await prisma.product.update({
      where: { id },
      data: { status: "Active" },
    });
    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/inventory");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to publish product.");
  }
}

// ──── Category Actions ────

export async function createCategory(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const banner = formData.get("banner") as string | null;
    const circleImage = formData.get("circleImage") as string | null;
    const isFeatured = formData.get("isFeatured") === "on";

    if (!name?.trim()) {
      throw new Error("Category name is required.");
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        banner: banner?.trim() || null,
        circleImage: circleImage?.trim() || null,
        isFeatured,
      },
    });

    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return {
        success: false,
        error: "A category with this name already exists.",
      };
    }

    if (error?.code === "P1001") {
      return {
        success: false,
        error: "The database is currently unreachable. Please try again in a moment.",
      };
    }

    return {
      success: false,
      error: error?.message || "Failed to create category.",
    };
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    const banner = formData.get("banner") as string | null;
    const circleImage = formData.get("circleImage") as string | null;
    const isFeatured = formData.get("isFeatured") === "on";

    await prisma.category.update({
      where: { id },
      data: {
        banner: banner?.trim() || null,
        circleImage: circleImage?.trim() || null,
        isFeatured,
      },
    });

    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to update category.");
  }
}

export async function deleteCategory(id: number) {
  try {
    const cat = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (cat?._count.products && cat._count.products > 0) {
      throw new Error("Cannot delete a category that has products.");
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete category.");
  }
}

export async function createUnit(
  _prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const name = (formData.get("name") as string)?.trim();
    const usage = (formData.get("usage") as string)?.trim();

    if (!name) {
      throw new Error("Unit name is required.");
    }

    const existing = await prisma.unit.findUnique({
      where: { name },
    });

    if (existing) {
      throw new Error("A unit with this name already exists.");
    }

    await prisma.unit.create({
      data: {
        name,
        usage: usage || null,
      },
    });

    revalidatePath("/dashboard/products/units");
    revalidatePath("/dashboard/products/add");
    revalidatePath("/dashboard/products");
    return { success: true, error: null };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create unit.",
    };
  }
}

export async function updateUnit(
  id: number,
  _prevState: { success: boolean; error: string | null },
  formData: FormData
) {
  try {
    const name = (formData.get("name") as string)?.trim();
    const usage = (formData.get("usage") as string)?.trim();

    if (!name) {
      throw new Error("Unit name is required.");
    }

    const currentUnit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!currentUnit) {
      throw new Error("Unit not found.");
    }

    const duplicate = await prisma.unit.findUnique({
      where: { name },
    });

    if (duplicate && duplicate.id !== id) {
      throw new Error("A unit with this name already exists.");
    }

    await prisma.$transaction([
      prisma.unit.update({
        where: { id },
        data: {
          name,
          usage: usage || null,
        },
      }),
      prisma.product.updateMany({
        where: { unit: currentUnit.name },
        data: { unit: name },
      }),
    ]);

    revalidatePath("/dashboard/products/units");
    revalidatePath(`/dashboard/products/units/${id}/edit`);
    revalidatePath("/dashboard/products/add");
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    return { success: true, error: null };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to update unit.",
    };
  }
}

export async function deleteUnit(id: number) {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      throw new Error("Unit not found.");
    }

    const productCount = await prisma.product.count({
      where: { unit: unit.name },
    });

    if (productCount > 0) {
      throw new Error("Cannot delete a unit that is assigned to products.");
    }

    await prisma.unit.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products/units");
    revalidatePath("/dashboard/products/add");
    revalidatePath("/dashboard/products");
  } catch (error: any) {
    throw new Error(error?.message || "Failed to delete unit.");
  }
}
