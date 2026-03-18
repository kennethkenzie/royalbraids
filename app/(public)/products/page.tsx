"use client";

import { Heart, Minus, Plus, Star, Scissors, Sparkles, ShieldCheck, Camera, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const braidSwatches = [
  { id: 1, color: "#1b0f0a", name: "1 - Jet Black" },
  { id: 2, color: "#3b2314", name: "1B - Natural Black" },
  { id: 3, color: "#5a3825", name: "2 - Dark Brown" },
  { id: 4, color: "#7a4c2f", name: "4 - Medium Brown" },
  { id: 5, color: "#8b5e3c", name: "6 - Chestnut Brown" },
  { id: 6, color: "#b78b5e", name: "8 - Light Brown" },
  { id: 7, color: "#c89b6d", name: "27 - Honey Blonde" },
  { id: 8, color: "#d2a679", name: "30 - Light Auburn" },
  { id: 9, color: "#7a1f1f", name: "99J - Burgundy" },
  { id: 10, color: "#b6132a", name: "Red Wine" },
  { id: 11, color: "#c9c1b7", name: "613 - Platinum Blonde" },
  { id: 12, color: "#6b4ea2", name: "Purple Blend" },
  { id: 13, color: "#1a4b7a", name: "Blue Blend" },
  { id: 14, color: "#c85f92", name: "Pink Blend" },
];

const gallery = [
  "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773693574/new3_liydsg.png",
  "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773692504/new1_m8z7aj.png",
  "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773691111/slider_3_v0fzgs.png",
  "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773693574/new3_liydsg.png",
  "https://res.cloudinary.com/doh2vn9zn/image/upload/v1773692504/new1_m8z7aj.png",
];

export default function BraidsProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const [selectedShade, setSelectedShade] = useState(braidSwatches[1]);
  const [qty, setQty] = useState(1);

  const decreaseQty = () => setQty((prev) => Math.max(1, prev - 1));
  const increaseQty = () => setQty((prev) => prev + 1);

  return (
    <section className="min-h-screen bg-white px-4 py-8 md:px-8 xl:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Back Button */}
        <Link 
          href="/" 
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-black/60 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[760px_minmax(420px,1fr)]">
          {/* Left Media Section */}
          <div className="grid grid-cols-1 md:grid-cols-[120px_minmax(0,1fr)] gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden border transition aspect-square ${
                    selectedImage === image
                      ? "border-black"
                      : "border-black/20 hover:border-black/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Braids view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="overflow-hidden bg-white rounded-[2px] cursor-default">
              <img
                src={selectedImage}
                alt="Premium braids product"
                className="h-full min-h-[500px] md:min-h-[720px] w-full object-cover"
              />
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`shrink-0 w-20 aspect-square overflow-hidden border transition ${
                    selectedImage === image
                      ? "border-black"
                      : "border-black/20"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Braids view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Section */}
          <div className="pt-2">
            {/* Breadcrumb */}
            <div className="mb-5 text-[13px] text-black/70">
              Home / Braids / Premium Pre-Stretched Braiding Hair
            </div>

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="bg-[#f3e1d7] px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-black">
                New
              </span>
              <span className="bg-[#f3e1d7] px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-black">
                Best Seller
              </span>
            </div>

            {/* Title + Wishlist */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="max-w-[520px] text-[34px] font-black uppercase leading-[1.1] tracking-[0.06em] text-black">
                Premium Pre-Stretched Braiding Hair
              </h1>

              <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/20 text-black transition hover:border-black">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Price */}
            <div className="mb-4 text-[24px] font-black text-black">
              UGX 22,000
            </div>

            {/* Rating */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex items-center gap-1 text-black">
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 fill-black text-black" />
                <Star className="h-4 w-4 text-black" />
              </div>
              <a href="#" className="text-[15px] underline underline-offset-2 font-medium">
                284 Reviews
              </a>
            </div>

            {/* Description */}
            <p className="mb-8 max-w-[620px] text-[17px] leading-[1.5] text-zinc-700">
              Get sleek, lightweight, and tangle-free braids with this premium
              pre-stretched braiding hair. Soft on the hands, easy to separate,
              and perfect for knotless braids, box braids, twists, and cornrow
              styles with long-lasting comfort.
            </p>

            {/* Feature icons */}
            <div className="mb-10 grid grid-cols-2 gap-6 text-black md:grid-cols-4">
              <div className="flex items-center gap-3">
                <Scissors className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Easy
                  <br />
                  styling
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Soft
                  <br />
                  texture
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Long-lasting
                  <br />
                  wear
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 stroke-[1.2]" />
                <span className="text-[14px] font-medium leading-[1.2]">
                  Natural
                  <br />
                  finish
                </span>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-6 flex flex-wrap gap-2 text-black">
              <button className="border border-black bg-black px-6 py-2 text-[13px] font-bold uppercase text-white tracking-widest">
                All
              </button>
              <button className="border border-black/10 bg-white px-6 py-2 text-[13px] font-bold uppercase tracking-widest transition hover:border-black">
                Ombre
              </button>
              <button className="border border-black/10 bg-white px-6 py-2 text-[13px] font-bold uppercase tracking-widest transition hover:border-black">
                Solid
              </button>
            </div>

            {/* Swatches */}
            <div className="mb-8 grid grid-cols-7 gap-2 md:grid-cols-10">
              {braidSwatches.map((shade) => (
                <button
                  key={shade.id}
                  onClick={() => setSelectedShade(shade)}
                  title={shade.name}
                  className={`relative h-12 w-full border transition ${
                    selectedShade.id === shade.id
                      ? "border-black ring-1 ring-black scale-105 z-10"
                      : "border-black/10 hover:border-black/40"
                  }`}
                  style={{ backgroundColor: shade.color }}
                >
                  {selectedShade.id === shade.id && (
                    <span className="absolute -right-1 -top-1 bg-black px-1 text-[8px] font-bold uppercase text-white shadow-sm">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Variation select */}
            <div className="mb-6">
              <label className="mb-3 block text-[13px] font-bold uppercase tracking-wider text-black">
                Color selected: {selectedShade.name}
              </label>
              <div className="flex items-center gap-3 border border-black/15 bg-white px-4 py-3 rounded-[2px]">
                <span
                  className="h-8 w-8 border border-black/10 rounded-full"
                  style={{ backgroundColor: selectedShade.color }}
                />
                <select
                  className="w-full bg-transparent text-[16px] text-black outline-none font-medium"
                  value={selectedShade.name}
                  onChange={(e) => {
                    const found = braidSwatches.find(
                      (shade) => shade.name === e.target.value
                    );
                    if (found) setSelectedShade(found);
                  }}
                >
                  {braidSwatches.map((shade) => (
                    <option key={shade.id} value={shade.name}>
                      {shade.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Try on button */}
            <button className="mb-8 flex w-full items-center justify-center gap-3 border border-black/15 bg-white px-4 py-4 text-[15px] font-bold uppercase tracking-widest text-black transition hover:bg-zinc-50 hover:border-black/30 rounded-[2px]">
              <Camera className="h-5 w-5" />
              Try This Style On
            </button>

            {/* Cart controls */}
            <div className="flex w-full overflow-hidden border border-black rounded-[2px] shadow-sm">
              <div className="flex min-w-[150px] items-center justify-between bg-white px-6">
                <button
                  onClick={decreaseQty}
                  className="p-2 transition hover:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="text-[18px] font-bold text-black">{qty}</span>

                <button
                  onClick={increaseQty}
                  className="p-2 transition hover:opacity-50"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button className="flex-1 bg-black px-8 py-5 text-[15px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800">
                Add to Cart
              </button>
            </div>

            {/* Extra assurance */}
            <div className="mt-8 flex items-center gap-4 text-black shadow-sm bg-white p-4 rounded-[2px] border border-black/5">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <div className="text-[14px]">
                <p className="font-bold">Authentic Quality Guaranteed</p>
                <p className="text-zinc-500">100% Genuine Royal Braids Product</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
