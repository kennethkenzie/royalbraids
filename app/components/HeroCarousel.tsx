"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 5,
    image:
      "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773692504/new1_m8z7aj.png",
    eyebrow: "EXCLUSIVE",
    title: "SIGNATURE\nBRAIDING\nSTYLES",
    description:
      "Elevate your look with our exclusive collection of hand-crafted styles designed for elegance.",
    button: "SHOP COLLECTION",
    bg: "bg-[#e5d1c8]",
    overlay: "from-[#e5d1c8]/70 to-[#e5d1c8]/30",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773693574/new3_liydsg.png",
    eyebrow: "WHAT'S NEW",
    title: "DISCOVER\nOUR NEW\nCOLLECTION",
    description:
      "Modern extensions and braiding styles designed for the sophisticated woman. Explore our latest arrivals.",
    button: "DISCOVER NOW",
    bg: "bg-[#dec7ba]",
    overlay: "from-[#dec7ba]/70 to-[#dec7ba]/30",
  },
  // {
  //   id: 0,
  //   image:
  //     "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773691111/slider_3_v0fzgs.png",
  //   eyebrow: "FEATURED",
  //   title: "PREMIUM\nSALON\nEXPERIENCE",
  //   description:
  //     "Welcome to Royal Braids. Discover the art of braiding with our master stylists in a luxury setting.",
  //   button: "EXPLORE MORE",
  //   bg: "bg-[#b8a090]",
  //   overlay: "from-[#b8a090]/70 to-[#b8a090]/30",
  // },
  // {
  //   id: 1,
  //   image:
  //     "https://images.unsplash.com/photo-1582236314820-2ce78c976936?q=80&w=1600&auto=format&fit=crop",
  //   eyebrow: "TRENDING",
  //   title: "SLEEK\nKNOTLESS\nBRAIDS",
  //   description:
  //     "Experience the perfect blend of luxury and comfort with our signature light-weight knotless installs.",
  //   button: "BOOK NOW",
  //   bg: "bg-[#c9b0bc]",
  //   overlay: "from-[#c9b0bc]/70 to-[#c9b0bc]/30",
  // },
  // {
  //   id: 2,
  //   image:
  //     // "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1600&auto=format&fit=crop",
  //   eyebrow: "BESTSELLER",
  //   title: "EXPERT\nCROCHET\nINSTALLS",
  //   description:
  //     "Versatile, protective, and naturally beautiful. Get that salon-fresh look in half the time.",
  //   button: "VIEW STYLES",
  //   bg: "bg-[#d5b7c0]",
  //   overlay: "from-[#d5b7c0]/70 to-[#d5b7c0]/30",
  // },
  // {
  //   id: 3,
  //   image:
  //     // "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1600&auto=format&fit=crop",
  //   eyebrow: "NEW ARRIVAL",
  //   title: "LUXURY\nWEAVES &\nCLOSURES",
  //   description:
  //     "Premium quality hair, flawlessly installed. The ultimate transformation for the modern woman.",
  //   button: "SHOP HAIR",
  //   bg: "bg-[#c8aeb6]",
  //   overlay: "from-[#c8aeb6]/70 to-[#c8aeb6]/30",
  // },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[250px] w-full overflow-hidden bg-white font-sans md:h-[600px] lg:h-[800px]">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === current
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <div className="relative z-20 mx-auto h-full max-w-[1400px] px-4 md:px-10 lg:px-16">
              <div className="grid h-full w-full grid-cols-2 items-center gap-4 md:gap-12 lg:gap-20">
                {/* Left: Text Content */}
                <div className="flex flex-col justify-center py-4 text-left">
                  <p className="mb-1 text-[8px] font-medium uppercase tracking-[0.3em] text-zinc-500 md:mb-6 md:text-[12px] md:tracking-[0.4em]">
                    {slide.eyebrow}
                  </p>

                  <h1 className="whitespace-pre-line text-[20px] font-bold uppercase leading-[1.1] tracking-tight text-black md:text-[48px] lg:text-[72px]">
                    {slide.title}
                  </h1>

                  <p className="mt-1 text-[10px] leading-relaxed text-zinc-600 md:mt-8 md:text-[16px] lg:max-w-[480px] lg:text-[18px]">
                    {slide.description}
                  </p>

                  <div>
                    <button className="mt-3 inline-flex h-[32px] items-center justify-center bg-black px-4 text-[9px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 md:mt-10 md:h-[56px] md:px-12 md:text-[14px]">
                      {slide.button}
                    </button>
                  </div>
                </div>

                {/* Right: Image */}
                <div className="flex h-full items-end justify-end md:pr-4 lg:pr-10">
                  <div className="relative h-full w-full max-h-[250px] md:max-h-[500px] lg:max-h-[750px] xl:max-h-[800px]">
                    <Image
                      src={slide.image}
                      alt={slide.title.replace(/\n/g, " ")}
                      fill
                      priority={index === 0}
                      unoptimized
                      className="object-contain object-bottom scale-100 md:scale-110 origin-bottom"
                      sizes="(max-width: 768px) 50vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              current === index ? "w-8 bg-black" : "w-2 bg-black/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
