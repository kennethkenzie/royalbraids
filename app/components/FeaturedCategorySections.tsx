import { Star } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

async function getFeaturedCategories() {
  noStore();

  try {
    return await prisma.category.findMany({
      where: { isFeatured: true, banner: { not: null } },
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
        const bannerBg = isEven ? "bg-[#1f1f1f]" : "bg-[#2c2c2c]";

        return (
          <section key={category.id} className={`w-full ${bg} px-5 py-12 md:px-7 md:py-24 xl:px-8`}>
            <div className="mx-auto max-w-full">
              {/* Section Header */}
              <div className="mb-10 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Category Collection
                  </p>
                  <h2 className="text-[32px] font-black uppercase tracking-tight text-black md:text-[42px] leading-none">
                    {category.name}
                  </h2>
                </div>
                <div className="hidden items-center gap-4 pt-2 md:flex">
                  <Link
                    href="/inventory"
                    className="text-[14px] font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:opacity-60 transition"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-2 md:gap-4">
                {/* Left Banner */}
                <article className={`shrink-0 xl:basis-[400px] ${bannerBg}`}>
                  <div className="flex h-full min-h-[600px] xl:min-h-[700px] flex-col">
                    <div className="relative flex-1 overflow-hidden">
                      <img
                        src={category.banner!}
                        alt={`${category.name} collection`}
                        className="h-full w-full object-cover object-top opacity-90 transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/50" />
                    </div>

                    <div className="flex flex-col px-8 py-10">
                      <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">
                        Royal Braids Studio
                      </p>
                      <h3 className="mt-2 text-[26px] font-black uppercase leading-[1.1] text-white">
                        Shop {category.name}
                      </h3>
                      <p className="mt-3 text-[16px] text-white/60">
                        {category.products.length} styles available
                      </p>
                      <div className="mt-8">
                        <Link
                          href="/inventory"
                          className="inline-block min-w-[160px] border border-white px-8 py-4 text-[14px] font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black text-center"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Right Product Cards — Scrollable */}
                <div className="scrollbar-hide flex-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-10 select-none md:gap-3 cursor-grab active:cursor-grabbing">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="cursor-default snap-start shrink-0 basis-[280px] sm:basis-[320px] xl:basis-[360px] group"
                    >
                      <article>
                        {/* Image */}
                        <div className="relative h-[480px] overflow-hidden bg-[#e8e5e0] transition-transform duration-500 group-hover:translate-y-[-2px] rounded-[2px]">
                          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                            <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
                              {category.name}
                            </span>
                          </div>

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="block h-[480px] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                            />
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
