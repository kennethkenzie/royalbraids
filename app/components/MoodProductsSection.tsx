"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { cloudinaryImages } from "@/lib/cloudinary";
import Link from "next/link";

type Product = {
  id: number;
  image: string;
  tag1?: string;
  tag2?: string;
  title: string;
  shades?: string;
  price: string;
  bg: string;
};

const baseProducts: Product[] = [
  {
    id: 1,
    image: cloudinaryImages.productOne,
    tag1: "NEW",
    title: "Premium Jumbo Knotless Braids - Midnight Black",
    price: "USH 369,000",
    bg: "bg-[#d8d3dc]",
  },
  {
    id: 2,
    image: cloudinaryImages.productTwo,
    tag1: "BESTSELLER",
    tag2: "NATURAL LOOK",
    title: "Sleek Boho Braids with Human Hair Curls",
    shades: "Available in 5 colors",
    price: "USH 187,000",
    bg: "bg-[#ece9e3]",
  },
  {
    id: 3,
    image: cloudinaryImages.productThree,
    tag1: "NEW",
    title: "Crochet Passion Twists - Pre-looped Extensions",
    price: "USH 150,000",
    bg: "bg-[#bfd1cb]",
  },
  {
    id: 4,
    image: cloudinaryImages.productFour,
    tag1: "LIMITED EDITION",
    title: "Textured Butterfly Locs - Premium Fiber",
    shades: "4 lengths available",
    price: "USH 108,000",
    bg: "bg-[#ece7e4]",
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group snap-start shrink-0 basis-[300px] sm:basis-[340px] xl:basis-[380px]">
      <div
        className={`relative h-[480px] overflow-hidden ${product.bg} transition-transform duration-500 group-hover:translate-y-[-2px] rounded-[2px]`}
      >
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          {product.tag1 && (
            <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
              {product.tag1}
            </span>
          )}
          {product.tag2 && (
            <span className="bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black shadow-sm">
              {product.tag2}
            </span>
          )}
        </div>

        <img
          src={product.image}
          alt={product.title}
          className="block h-[480px] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col pt-6 h-[200px]">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-[18px] font-semibold leading-[1.25] text-black group-hover:underline underline-offset-4 uppercase tracking-tight">
            {product.title}
          </h3>

          <div className="h-6">
            {product.shades && (
              <p className="mt-2 text-[14px] font-medium text-zinc-500 italic">
                {product.shades}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1 text-black">
            <Star className="h-4 w-4 fill-black text-black" />
            <Star className="h-4 w-4 fill-black text-black" />
            <Star className="h-4 w-4 fill-black text-black" />
            <Star className="h-4 w-4 fill-black text-black" />
            <Star className="h-4 w-4 text-black" />
          </div>
        </div>

        <p className="mt-4 text-[20px] font-black tracking-tight text-black">
          {product.price}
        </p>
      </div>
    </article>
  );
}

export default function PremiumMoodProductsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const scrollAmount = useMemo(() => 420, []);

  const updateProgress = () => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth === 0) return;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (maxScroll <= 0) {
      setProgress(100);
      return;
    }

    const progressPct = (el.scrollLeft / maxScroll) * 100;
    setProgress(Math.min(100, Math.max(0, progressPct)));
  };

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    setIsDragging(true);
    dragState.current.startX = e.pageX - el.offsetLeft;
    dragState.current.scrollLeft = el.scrollLeft;
    dragState.current.moved = false;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;

    if (Math.abs(walk) > 4) {
      dragState.current.moved = true;
    }

    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const el = scrollRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      updateProgress();
    }, 100);

    const onScroll = () => updateProgress();
    const onResize = () => updateProgress();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isMounted]);

  if (!isMounted) {
    return <section className="w-full bg-[#f4f4f2] h-[600px]" />;
  }

  return (
    <section className="w-full bg-[#f4f4f2] px-5 py-12 md:px-7 md:py-24 xl:px-8">
      <div className="mx-auto max-w-full">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-black uppercase tracking-tight text-black md:text-[42px] leading-none">
              Must-Haves For Every Mood
            </h2>
            <p className="mt-3 text-[18px] text-zinc-600">
              New braiding arrivals + fam faves for every style.
            </p>
          </div>

          <div className="hidden items-center gap-4 pt-2 md:flex">
            <button
              onClick={() => scrollByAmount("left")}
              className="text-black transition hover:opacity-60"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollByAmount("right")}
              className="text-black transition hover:opacity-60"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-2 md:gap-4">
          {/* Left Promo Banner - Fixed */}
          <article className="shrink-0 basis-[400px] md:basis-[450px]">
            <div className="flex h-full min-h-[650px] flex-col bg-[#d994ad] transition-transform duration-500 hover:scale-[1.01]">
              <div className="relative h-[500px] md:h-[550px] overflow-hidden">
                <img
                  src={cloudinaryImages.heroSlideOne}
                  alt="Signature Braiding Collection"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>

              <div className="flex flex-1 flex-col px-8 py-10 justify-center">
                <h3 className="text-[26px] font-black uppercase leading-[1.1] text-black">
                  PREMIUM BRAIDING HAIR COLLECTION
                </h3>

                <p className="mt-4 text-[18px] text-black/80">
                  Crafted for elegance. Back by popular demand.
                </p>

                <div className="mt-8">
                  <button className="min-w-[180px] bg-black px-10 py-5 text-[15px] font-bold uppercase tracking-widest text-white transition hover:bg-neutral-800">
                    Dream Big
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Right Product Cards - Scrollable */}
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            className={`scrollbar-hide flex-1 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-10 select-none md:gap-3 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {baseProducts.map((product) => (
              <Link 
                key={product.id} 
                href="/products"
                className="cursor-default"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </div>

        {/* Premium progress bar */}
        <div className="relative mt-2 h-[3px] w-full overflow-hidden bg-black/10">
          <div
            className="absolute left-0 top-0 h-full bg-black transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
