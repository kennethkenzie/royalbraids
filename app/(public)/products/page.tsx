import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getProducts(category?: string) {
  try {
    const where: any = { status: "Active" };
    if (category) {
      where.category = { slug: category };
    }
    
    return await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch storefront products:", error);
    return [];
  }
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string }> 
}) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  return (
    <section className="min-h-screen bg-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-[1320px]">
        <Link
          href="/"
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-black/60 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="mb-10">
          <h1 className="text-[34px] font-black uppercase tracking-tight text-black">
            Products
          </h1>
          <p className="mt-3 text-[17px] text-zinc-600">
            Browse live inventory from the Royal Braids catalog.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-8 py-16 text-center text-zinc-500">
            No active products available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group"
              >
                <article className="overflow-hidden rounded-[2px] border border-zinc-100 bg-white">
                  <div className="relative h-[420px] overflow-hidden bg-zinc-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[80px] font-black uppercase text-zinc-300">
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="bg-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        {product.category.name}
                      </span>
                    </div>
                    <h2 className="line-clamp-2 text-[20px] font-bold uppercase tracking-tight text-black">
                      {product.name}
                    </h2>
                    <div className="mt-3 flex items-center gap-1 text-black">
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 fill-black text-black" />
                      <Star className="h-4 w-4 text-black" />
                    </div>
                    <p className="mt-4 text-[20px] font-black text-black">
                      UGX {product.priceInCents.toLocaleString()}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
