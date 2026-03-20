"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import crypto from 'node:crypto';

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
      colors.map(async (c: { name: string; hex: string; code?: string }) => {
        return await prisma.color.upsert({
          where: { hex: c.hex },
          update: {
            name: c.name,
            code: c.code || null,
          },
          create: {
            name: c.name,
            hex: c.hex,
            code: c.code || null,
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
      colors.map(async (c: { name: string; hex: string; code?: string }) => {
        return prisma.color.upsert({
          where: { hex: c.hex },
          update: {
            name: c.name,
            code: c.code || null,
          },
          create: {
            name: c.name,
            hex: c.hex,
            code: c.code || null,
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
    // Cascading delete of variations and then the product
    await prisma.$transaction([
      // First, delete all variations associated with this product
      prisma.variation.deleteMany({
        where: { productId: id },
      }),
      // Then, delete the product itself
      prisma.product.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/inventory");
    
  } catch (error: any) {
    console.error("PRISMA ERROR (Delete Product):", error);
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
    // Perform cascading delete of products and then the category
    await prisma.$transaction([
      // First, delete all products associated with this category
      prisma.product.deleteMany({
        where: { categoryId: id },
      }),
      // Then, delete the category itself
      prisma.category.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/dashboard/products/category");
    revalidatePath("/");
    revalidatePath("/dashboard/products");
    revalidatePath("/products");
    revalidatePath("/inventory");
    
  } catch (error: any) {
    console.error("PRISMA ERROR (Delete Category):", error);
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

// ──── Reel Actions ────

export async function createReel(formData: FormData) {
  try {
    const video = formData.get("video") as string;
    const poster = formData.get("poster") as string;
    const productImage = formData.get("productImage") as string;
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const link = formData.get("link") as string;

    if (!video || !productImage || !title || !price) {
      throw new Error("Missing required fields for Reel.");
    }

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Reel" (video, poster, "productImage", title, price, link, "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      video,
      poster || null,
      productImage,
      title,
      price,
      link || "/products"
    );

    revalidatePath("/dashboard/content/reels");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create reel:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteReel(id: number) {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "Reel" WHERE id = $1`, id);
    revalidatePath("/dashboard/content/reels");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete reel:", error);
    return { success: false, error: error.message };
  }
}

// ──── Order Actions ────

export async function createOrder(data: any) {
  try {
    const orderNumber = `RB-${Math.floor(100000 + Math.random() * 900000)}`;
    const { items, customerName, email, phone, address, city, totalPrice } = data;

    // Use raw SQL to insert the order
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Order" ("orderNumber", "totalCents", "status", "customerName", "email", "phone", "address", "city", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    `, orderNumber, parseInt(totalPrice), "Pending", customerName, email, phone, address, city);

    // Get the newly created order's ID
    const orders: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Order" WHERE "orderNumber" = $1 LIMIT 1`, orderNumber);
    if (orders.length === 0) throw new Error("Failed to retrieve created order");
    const orderId = orders[0].id;

    // Insert order items
    for (const item of items) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "OrderItem" ("productId", "quantity", "price", "orderId")
        VALUES ($1, $2, $3, $4)
      `, item.id, item.quantity, item.price, orderId);
    }

    return { success: true, orderNumber };
  } catch (err: any) {
    console.error("Order creation error:", err);
    return { success: false, error: err.message || "Failed to create order" };
  }
}

export async function getOrder(orderNumber: string) {
  try {
    const orders: any[] = await prisma.$queryRawUnsafe(`
      SELECT * FROM "Order" WHERE "orderNumber" = $1 LIMIT 1
    `, orderNumber);
    
    if (orders.length === 0) return null;
    
    const order = orders[0];
    
    // Get items for this order
    const items: any[] = await prisma.$queryRawUnsafe(`
      SELECT oi.*, p.name, p.image 
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      WHERE oi."orderId" = $1
    `, order.id);
    
    return { ...order, items };
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    await prisma.$executeRawUnsafe(`
      UPDATE "Order" SET "status" = $1, "updatedAt" = NOW() WHERE "id" = $2
    `, status, orderId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ──── Client Auth Actions ────

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function registerClient(data: any) {
  try {
    const fullName = data.fullName;
    const phone = data.phone.trim();
    const password = data.password;
    const hashedPassword = hashPassword(password);

    console.log(`Attempting to register user: ${phone}`);

    // Check if user already exists
    const existing: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "phone" = $1 LIMIT 1`, phone);
    if (existing.length > 0) {
      return { success: false, error: "A user with this phone number already exists." };
    }

    // Insert user
    await prisma.$executeRawUnsafe(`
      INSERT INTO "User" ("fullName", "phone", "password", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, NOW(), NOW())
    `, fullName, phone, hashedPassword);

    console.log(`User registered successfully: ${phone}`);
    return { success: true };
  } catch (err: any) {
    console.error("Registration error:", err);
    return { success: false, error: err.message || "Failed to create account" };
  }
}

export async function signinClient(data: any) {
  try {
    const phone = data.phone.trim();
    const password = data.password;
    const hashedPassword = hashPassword(password);

    console.log(`Login attempt for: ${phone}`);

    const users: any[] = await prisma.$queryRawUnsafe(`
      SELECT "id", "fullName", "phone" FROM "User" 
      WHERE "phone" = $1 AND "password" = $2 LIMIT 1
    `, phone, hashedPassword);

    if (users.length === 0) {
      console.log(`Login failed for: ${phone}`);
      return { success: false, error: "Invalid phone number or password." };
    }

    console.log(`Login successful for: ${phone}`);
    // Success - user is authenticated
    return { success: true, user: users[0] };
  } catch (err: any) {
    console.error("Signin error:", err);
    return { success: false, error: "Authentication failed. Server issue." };
  }
}


