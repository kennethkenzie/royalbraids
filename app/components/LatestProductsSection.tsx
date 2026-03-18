import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getLatestProducts() {
  return await prisma.product.findMany({
    where: { status: "Active" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
}

export default async function LatestProductsSection() {
  const products = await getLatestProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white px-5 py-12 md:px-7 md:py-24 xl:px-8">
      <div className="mx-auto max-w-full">
        {/* Section Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-black uppercase tracking-tight text-black md:text-[42px] leading-none">
              Latest Products
            </h2>
            <p className="mt-3 text-[18px] text-zinc-600">
              Fresh arrivals, straight from our collection.
            </p>
          </div>

          <div className="hidden items-center gap-4 pt-2 md:flex">
            <Link href="/inventory" className="text-[14px] font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:opacity-60 transition">
              View All
            </Link>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-2 md:gap-4">
          {/* Left Promo Banner - Fixed */}
          <article className="shrink-0 xl:basis-[400px]">
            <div className="flex h-full min-h-[600px] xl:min-h-[700px] flex-col bg-[#1a1a1a]">
              <div className="relative flex-1 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/doh2vn9zn/image/upload/f_auto,q_auto,w_1600/v1773692504/new1_m8z7aj.png"
                  alt="Latest Braiding Collection"
                  className="h-full w-full object-cover object-top opacity-80 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
              </div>

              <div className="flex flex-col px-8 py-10">
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Royal Braids Studio
                </p>
                <h3 className="mt-2 text-[28px] font-black uppercase leading-[1.1] text-white">
                  JUST IN. SHOP THE NEW ARRIVALS.
                </h3>

                <p className="mt-4 text-[17px] text-white/70">
                  Hand-crafted quality, every style.
                </p>

                <div className="mt-8">
                  <Link
                    href="/inventory"
                    className="inline-block min-w-[180px] border border-white px-10 py-4 text-[15px] font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-black text-center"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Right Product Cards - Scrollable */}
          <div className="scrollbar-hide flex-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-10 select-none md:gap-3 cursor-grab active:cursor-grabbing">
            {products.map((product) => (
              <Link
                key={product.id}
                href="/products"
                className="cursor-default snap-start shrink-0 basis-[280px] sm:basis-[320px] xl:basis-[360px] group"
              >
                <article>
                  {/* Image */}
                  <div className={`relative h-[480px] overflow-hidden bg-[#e8e5e0] transition-transform duration-500 group-hover:translate-y-[-2px] rounded-[2px]`}>
                    <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
                      {product.status && (
                        <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
                          New
                        </span>
                      )}
                      {product.category?.name && (
                        <span className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                          {product.category.name}
                        </span>
                      )}
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
                      {product.category?.name && (
                        <p className="mt-1 text-[13px] text-zinc-500 italic">
                          {product.category.name}
                        </p>
                      )}
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

        {/* Progress indicator line */}
        <div className="relative mt-2 h-[3px] w-full overflow-hidden bg-black/10">
          <div className="absolute left-0 top-0 h-full w-[40%] bg-black transition-[width] duration-300 ease-out" />
        </div>
      </div>
    </section>
  );
}
