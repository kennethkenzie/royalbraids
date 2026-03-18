"use client";

import { useRef, useState, useEffect } from "react";
import { cloudinaryImage, cloudinaryVideo } from "@/lib/cloudinary";
import Link from "next/link";
import {
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  VolumeX,
  Volume2,
} from "lucide-react";

type ReelItem = {
  id: number;
  video: string;
  poster?: string;
  productImage: string;
  title: string;
  price: string;
};

const reelItems: ReelItem[] = [
  {
    id: 1,
    video: cloudinaryVideo("v1773774100/e6eef33b9b6d4495bb723f21c9f0ba71.HD-720p-4.5Mbps-59120538_o3lffp.mp4"),
    poster: cloudinaryImage("v1773774083/videoframe_17793_tdewpv.png"),
    productImage: cloudinaryImage("v1773774083/videoframe_17793_tdewpv.png"),
    title: "Hydrating Lip Oil",
    price: "Ush 92,000",
  },
  {
    id: 2,
    video: cloudinaryVideo("v1773774963/65ee80e0021b4fd287da5c75247240ec.HD-720p-1.6Mbps-57616409_p35nzd.mp4"),
    poster: cloudinaryImage("v1773774083/videoframe_6739_dfkzny.png"),
    productImage: cloudinaryImage("v1773774083/videoframe_6739_dfkzny.png"),
    title: "Fenty Eau de Parfum",
    price: "Ush 653,000",
  },
  {
    id: 3,
    video: cloudinaryVideo("v1773774955/3053b5fdc8984c5dbddcbcc340847efe.HD-720p-1.6Mbps-38275267_l4i8dh.mp4"),
    productImage: cloudinaryImage("v1773774083/videoframe_6739_dfkzny.png"),
    title: "Skin Care Collection",
    price: "Ush 185,000",
  },
  {
    id: 4,
    video: cloudinaryVideo("v1773774957/6376dc063f3f4c66bded082a3f05770a.HD-720p-1.6Mbps-74835841_q89wdn.mp4"),
    productImage: cloudinaryImage("v1773774083/videoframe_6739_dfkzny.png"),
    title: "Butta Drop Whipped Oil Body Cream",
    price: "Ush 215,000",
  },
  {
    id: 5,
    video: cloudinaryVideo("v1773774953/2a3f5f94d4364d77ae79c887a4ab0c8e.HD-720p-1.6Mbps-74836209_cgmllz.mp4"),
    productImage: cloudinaryImage("v1773774083/videoframe_17793_tdewpv.png"),
    title: "Hella Thicc Volumizing Mascara",
    price: "Ush 103,000",
  },
  {
    id: 6,
    video: cloudinaryVideo("v1773774953/0c04ddcdfea246469ad8ab0672a16e1c.HD-720p-1.6Mbps-67296383_xe0lwn.mp4"),
    productImage: cloudinaryImage("v1773774083/videoframe_17793_tdewpv.png"),
    title: "Gloss Bomb Universal Lip Luminizer",
    price: "Ush 108,000",
  },
  {
    id: 7,
    video: cloudinaryVideo("v1773774949/7bab17418b0d46f7bfece2c0e801a0b9.HD-720p-1.6Mbps-42845954_qmppa4.mp4"),
    productImage: cloudinaryImage("v1773774083/videoframe_6739_dfkzny.png"),
    title: "Butta Drop Hydrating Body Milk",
    price: "Ush 159,000",
  },
];

// Triple the items for infinite scroll effect
const tripledReelItems = [...reelItems, ...reelItems, ...reelItems];

function ReelCard({ 
  item, 
  isActive 
}: { 
  item: ReelItem; 
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div 
      className={`shrink-0 transition-all duration-700 ease-out py-8 md:py-20 ${
        isActive ? "z-10 scale-[1.12] md:scale-[1.25]" : "scale-100"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-[14px] bg-neutral-200 transition-all duration-700 shadow-lg md:shadow-2xl ${
          expanded 
            ? "w-[160px] md:w-[260px] h-[340px] md:h-[560px]" 
            : "w-[160px] md:w-[260px] h-[280px] md:h-[480px]"
        }`}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={item.video}
          poster={item.poster}
          muted={muted}
          loop
          playsInline
        />

        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          {muted ? <VolumeX size={12} className="md:hidden" /> : <Volume2 size={12} className="md:hidden" />}
          {muted ? <VolumeX size={16} className="hidden md:block" /> : <Volume2 size={16} className="hidden md:block" />}
        </button>
      </div>

      <div className={`mt-4 md:mt-8 w-[160px] md:w-[260px] rounded-[4px] border border-neutral-300 bg-white px-2 md:px-3 py-1.5 md:py-2 shadow-sm transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-[40px] w-[40px] md:h-[58px] md:w-[58px] shrink-0 overflow-hidden rounded-[2px] bg-white">
            <img
              src={item.productImage}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[11px] md:text-[14px] font-semibold leading-[1.15] text-black">
              {item.title}
            </h3>
            <p className="mt-1 text-[10px] md:text-[13px] font-semibold leading-none text-black">
              {item.price}
            </p>
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 pl-1">
            <button className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-black text-white transition hover:scale-105">
              <Plus size={12} className="md:hidden" strokeWidth={2.5} />
              <Plus size={16} className="hidden md:block" strokeWidth={2.5} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center text-black"
            >
              <ChevronUp
                size={14}
                className={`transition-transform duration-300 md:hidden ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              />
              <ChevronUp
                size={18}
                className={`transition-transform duration-300 hidden md:block ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReelsProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize scroll to middle set and set mounted state
  useEffect(() => {
    setIsMounted(true);
    setActiveId(reelItems[0].id);
    setActiveIndex(reelItems.length);

    if (scrollRef.current) {
      const container = scrollRef.current;
      const isMobile = window.innerWidth < 768;
      const itemWidth = isMobile ? 184 : 320; // 160 + 24 gap (mobile) or 260 + 56 gap (md:gap-14)
      container.scrollLeft = itemWidth * reelItems.length;
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollWidth = container.scrollWidth / 3;
    
    // Infinite Loop Jump Logic
    if (container.scrollLeft <= 0) {
      container.scrollLeft = scrollWidth;
    } else if (container.scrollLeft >= scrollWidth * 2) {
      container.scrollLeft = scrollWidth;
    }

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    const children = container.children[0].children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    setActiveIndex(closestIndex);
    setActiveId(tripledReelItems[closestIndex].id);
  };

  if (!isMounted) {
    return (
      <section className="w-full bg-white py-12 md:py-24">
        <div className="mx-auto h-[250px] md:h-[400px]" />
      </section>
    );
  }

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2.5; // Slightly faster scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const isMobile = window.innerWidth < 768;
    const itemWidth = isMobile ? 184 : 320;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft - itemWidth,
      behavior: "smooth",
    });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const isMobile = window.innerWidth < 768;
    const itemWidth = isMobile ? 184 : 320;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white py-8 md:py-24 overflow-hidden">
      <div className="mx-auto relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`scrollbar-hide overflow-x-auto px-4 md:px-10 cursor-grab active:cursor-grabbing ${isDragging ? "select-none" : ""}`}
        >
          <div className="flex gap-6 md:gap-14 pb-10 pt-10 min-w-max px-[10%] md:px-[35%]">
            {tripledReelItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                href="/products"
                className="cursor-default"
              >
                <ReelCard
                  item={item}
                  isActive={activeIndex === index}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="mt-4 md:mt-12 flex items-center justify-center gap-4 md:gap-6">
          <button
            onClick={scrollPrev}
            className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-all hover:bg-black hover:text-white"
            aria-label="Previous reel"
          >
            <ChevronLeft size={18} className="md:hidden" />
            <ChevronLeft size={24} className="hidden md:block" />
          </button>
          <button
            onClick={scrollNext}
            className="flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition-all hover:bg-black hover:text-white"
            aria-label="Next reel"
          >
            <ChevronRight size={18} className="md:hidden" />
            <ChevronRight size={24} className="hidden md:block" />
          </button>
        </div>
      </div>
    </section>
  );
}
