"use client";

import { Heart, ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cloudinaryImages } from "@/lib/cloudinary";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

export default function FentyHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();
  const navLinks = ["Closure", "Crochet Braid", "Weaves", "Braids", "Blog", "Contact Us", "Help"];
  const promoMessages = [
    "Free delivery in Kampala on qualifying orders",
    "New premium braid textures now available",
    "Book bulk orders for salons and resellers",
  ];

  return (
    <header className="w-full bg-black">
      <div className="w-full bg-white">
        {/* Top promotional black bar */}
        <div className="flex h-11 w-full items-center overflow-hidden bg-black text-white md:h-12">
          <div className="marquee-track">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="marquee-group">
                {promoMessages.map((message) => (
                  <span
                    key={`${copyIndex}-${message}`}
                    className="flex items-center gap-4 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em] md:text-xs"
                  >
                    <span className="text-white/55">*</span>
                    {message}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main top row */}
        <div className="flex h-[72px] items-center justify-between border-b border-zinc-200 px-6 md:h-[82px] md:px-12 lg:px-20">
          {/* Left: Mobile Menu & Country */}
          <div className="flex min-w-[80px] items-center gap-4 text-[12px] text-black md:min-w-[180px] md:text-sm">
            <button 
              className="hover:opacity-70 lg:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 stroke-[1.5]" />
            </button>
            <div className="hidden items-center gap-2 md:flex">
              <img 
                src={cloudinaryImages.ugFlag} 
                alt="UG Flag" 
                className="h-3 w-4.5 overflow-hidden rounded-[1px] object-cover"
              />
              <span className="font-medium">UG</span>
              <span className="hidden text-zinc-400 md:inline">|</span>
              <span className="hidden font-medium md:inline">English</span>
            </div>
          </div>

          {/* Center logo */}
          <div className="flex-1 text-center">
            <h1 className="select-none text-[13px] font-semibold font-sans uppercase tracking-[0.2em] text-black md:text-[24px] md:tracking-[0.55em] whitespace-nowrap">
              ROYAL BRAIDS LTD
            </h1>
          </div>

          {/* Right icons */}
          <div className="flex min-w-[80px] items-center justify-end gap-3 text-sm text-black md:min-w-[180px] md:gap-4">
            <Link href="/signin" className="flex items-center gap-1 hover:opacity-70 transition-colors">
              <User className="h-4 w-4 stroke-[1.6]" />
              <span className="hidden md:inline">Sign In</span>
            </Link>

            <button className="hover:opacity-70" aria-label="Search">
              <Search className="h-4 w-4 stroke-[1.6]" />
            </button>

            <button className="hover:opacity-70" aria-label="Wishlist">
              <Heart className="h-4 w-4 stroke-[1.6]" />
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-zinc-50 transition-colors" 
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.6] text-black" />
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-[4px] text-[10px] font-black leading-none text-white ring-2 ring-white transition-all group-hover:scale-110">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-12 border-b border-zinc-100 py-4 text-[18px] font-light font-sans text-black lg:flex">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="transition hover:opacity-70"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className="relative flex h-full w-[80%] max-w-[320px] flex-col bg-white p-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[18px] font-semibold font-sans uppercase tracking-widest text-black">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6 text-black stroke-[1.5]" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-[20px] font-light font-sans text-black">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="transition hover:opacity-60"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-8 border-t border-zinc-100 italic text-[14px] text-zinc-500">
            Experience the Royal touch.
          </div>
        </div>
      </div>
    </header>
  );
}
