import { Star } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

async function getFeaturedCategories() {
  noStore();

  try {
    return await prisma.category.findMany({
      where: { isFeatured: true, featuredBanner: { not: null } },
      include: {
        products: {
          where: { status: "Active" },
          orderBy: { createdAt: "desc" },
          take: 12,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch featured categories:", error);
    return [];
  }
}

import { TextAnimation } from "./ScrollAnimation";
import RoyalBraidsHero from "./RoyalBraidsHero";

export default async function FeaturedCategorySections() {
  const categories = await getFeaturedCategories();

  if (categories.length === 0) return null;

  return (
    <>
      {categories.map((category, i) => {
        if (category.products.length === 0) return null;

        // Alternate background for visual variety
        const isEven = i % 2 === 0;
        const bg = isEven ? "bg-[#f4f4f2]" : "bg-white";
        // const bannerBg = isEven ? "bg-[#1f1f1f]" : "bg-[#2c2c2c]";

        return (
          <section key={category.id} className={`w-full ${bg} px-5 py-12 md:px-7 md:py-24 xl:px-8`}>
            <div className="mx-auto max-w-full">
              {/* Section Header */}
              <div className="mb-10 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Category Collection
                  </p>
                  <TextAnimation 
                    text={category.name} 
                    className="text-[32px] font-black uppercase tracking-tight text-black md:text-[42px] leading-none"
                  />
                </div>
                <div className="hidden items-center gap-4 pt-2 md:flex">
                  <Link href="/products" className="text-[14px] font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:opacity-60 transition">
                    View All
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-4">
                {/* Product Cards — Scrollable */}
                <div className="scrollbar-hide flex-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-10 select-none md:gap-3 cursor-grab active:cursor-grabbing">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="cursor-default snap-start shrink-0 basis-[360px] sm:basis-[420px] xl:basis-[480px] group"
                    >
                      <article>
                        {/* Image */}
                        <div className="relative h-[580px] overflow-hidden bg-[#e8e5e0] transition-transform duration-500 group-hover:translate-y-[-2px] rounded-[2px]">
                          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                            <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
                              {category.name}
                            </span>
                          </div>

                          {product.image ? (
                            <>
                              <img
                                src={product.image}
                                alt={product.name}
                                className={`block h-[580px] w-full object-cover object-top transition-all duration-700 group-hover:scale-[1.05] ${(product as any).hoverImage ? 'group-hover:opacity-0' : 'opacity-100'}`}
                              />
                              {(product as any).hoverImage && (
                                <img
                                  src={(product as any).hoverImage}
                                  alt={`${product.name} hover`}
                                  className="absolute inset-0 block h-[580px] w-full object-cover object-top transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-[1.05]"
                                />
                              )}
                            </>
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-[60px] font-black text-zinc-300 uppercase">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col pt-6 h-[180px]">
                          <div className="flex-1">
                            <h3 className="line-clamp-2 text-[17px] font-semibold leading-[1.25] text-black group-hover:underline underline-offset-4 uppercase tracking-tight">
                              {product.name}
                            </h3>
                            <div className="mt-3 flex items-center gap-1 text-black">
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 fill-black text-black" />
                              <Star className="h-4 w-4 text-black" />
                            </div>
                          </div>
                          <p className="mt-4 text-[20px] font-black tracking-tight text-black">
                            UGX {product.priceInCents.toLocaleString()}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>

              {(category as any).featuredBanner && (
                <div className="mt-8 overflow-hidden rounded-2xl shadow-xl">
                  <RoyalBraidsHero 
                    category={{
                      name: category.name,
                      description: (category as any).description,
                      banner: (category as any).featuredBanner,
                      circleColor: (category as any).circleColor,
                      backgroundColor: (category as any).backgroundColor,
                    }} 
                  />
                </div>
              )}

              {/* Progress bar */}
              <div className="relative mt-2 h-[3px] w-full overflow-hidden bg-black/10">
                <div className="absolute left-0 top-0 h-full w-[40%] bg-black" />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
