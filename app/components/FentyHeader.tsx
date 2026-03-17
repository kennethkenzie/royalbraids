import { Heart, ShoppingBag, User, Search } from "lucide-react";

export default function FentyHeader() {
  const navLinks = ["Closure", "Crochet Braid", "Weaves", "Braids", "Blog", "Contact Us", "Help"];

  return (
    <header className="w-full bg-black">
      <div className="w-full bg-white">
        {/* Top thin black bar */}
        <div className="h-7 w-full bg-black" />

        {/* Main top row */}
        <div className="flex h-[62px] items-center justify-between border-b border-zinc-200 px-6 md:px-12 lg:px-20">
          {/* Left */}
          <div className="flex min-w-[180px] items-center gap-2 text-sm text-black">
            <img 
              src="https://flagcdn.com/ug.svg" 
              alt="UG Flag" 
              className="h-3 w-4.5 overflow-hidden rounded-[1px] object-cover"
            />
            <span className="font-medium">UG</span>
            <span className="text-zinc-400">|</span>
            <span className="font-medium">English</span>
          </div>

          {/* Center logo */}
          <div className="flex-1 text-center">
            <h1 className="select-none text-[22px] font-semibold font-sans uppercase tracking-[0.55em] text-black md:text-[24px]">
              ROYAL BRAIDS
            </h1>
          </div>

          {/* Right icons */}
          <div className="flex min-w-[180px] items-center justify-end gap-4 text-sm text-black">
            <button className="hidden items-center gap-1 hover:opacity-70 md:flex">
              <User className="h-4 w-4 stroke-[1.6]" />
              <span>Sign In</span>
            </button>

            <button className="hover:opacity-70" aria-label="Search">
              <Search className="h-4 w-4 stroke-[1.6]" />
            </button>

            <button className="hover:opacity-70" aria-label="Wishlist">
              <Heart className="h-4 w-4 stroke-[1.6]" />
            </button>

            <button className="hover:opacity-70" aria-label="Shopping bag">
              <ShoppingBag className="h-4 w-4 stroke-[1.6]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap px-6 py-4 text-[18px] font-light font-sans text-black md:gap-12">
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
    </header>
  );
}
