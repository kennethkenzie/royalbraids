"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";
import { ChevronLeft, ShoppingBag, Truck, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "Kampala",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-zinc-50 p-8 text-black">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-[24px] font-bold text-black uppercase tracking-tight">Your bag is empty</h1>
        <p className="mt-2 text-zinc-500">Add some products before checking out.</p>
        <Link href="/" className="mt-8 rounded-full bg-black px-10 py-4 text-[14px] font-bold text-white transition hover:bg-zinc-800 uppercase tracking-widest">
          Go To Store
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await createOrder({
      ...formData,
      items: cart,
      totalPrice,
    });

    if (result.success) {
      clearCart();
      router.push(`/track-order?orderNumber=${result.orderNumber}&success=true`);
    } else {
      setError(result.error || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-24">
      <div className="mb-12 flex items-center gap-4">
        <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white shadow-sm transition hover:bg-zinc-50">
          <ChevronLeft className="h-5 w-5 text-black" />
        </Link>
        <div>
          <h1 className="text-[28px] font-black text-black sm:text-[36px] uppercase tracking-tight leading-none">Checkout</h1>
          <p className="mt-2 text-[14px] text-zinc-500">Complete your order to experience the Royal touch.</p>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-[14px] font-medium text-red-600">
              {error}
            </div>
          )}

          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">1</div>
              <h2 className="text-[20px] font-bold text-black uppercase tracking-tight">Delivery Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-zinc-400">FullName *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sarah Nakato"
                    className="h-12 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-zinc-400">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 0770 000 000"
                    className="h-12 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. sarah@example.com"
                  className="h-12 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-zinc-400">City / Region *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="h-12 w-full appearance-none rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                  >
                    <option value="Kampala">Kampala (Free Delivery)</option>
                    <option value="Entebbe">Entebbe</option>
                    <option value="Wakiso">Wakiso</option>
                    <option value="Mukono">Mukono</option>
                    <option value="Jinja">Jinja</option>
                    <option value="Other">Other Region</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-zinc-400">Street / Area Details *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House No, Street, Landmark"
                    className="h-12 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-3 border-t border-zinc-50 pt-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white">2</div>
              <h2 className="text-[20px] font-bold text-black uppercase tracking-tight">Payment Method</h2>
            </div>
            
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-black">Pay on Delivery</p>
                  <p className="text-[13px] text-zinc-500 text-pretty">
                    Inspect your premium braids before paying. We accept Cash or Mobile Money at your doorstep.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-black text-[15px] font-black uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
            {isSubmitting ? "Processing..." : `Place Order • UGX ${totalPrice.toLocaleString()}`}
          </button>
        </form>

        {/* Right: Summary */}
        <aside className="h-fit rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl lg:sticky lg:top-10">
          <h2 className="mb-8 text-[20px] font-bold text-black uppercase tracking-tight">Order Summary</h2>
          
          <div className="scrollbar-hide max-h-[400px] space-y-6 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-zinc-100 font-bold text-zinc-200 uppercase">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h4 className="text-[14px] font-bold text-black line-clamp-1 uppercase">{item.name}</h4>
                  <p className="mt-1 text-[13px] text-zinc-500">Qty: {item.quantity}</p>
                  <p className="mt-1 text-[14px] font-bold text-black">UGX {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 border-t border-zinc-50 pt-8 text-[14px]">
            <div className="flex justify-between text-zinc-500">
              <span className="uppercase tracking-widest">Total Items</span>
              <span className="font-bold text-black">{totalItems}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span className="uppercase tracking-widest">Delivery Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between border-t border-zinc-50 pt-4 text-[20px] font-black text-black">
              <span className="uppercase tracking-tight">Grand Total</span>
              <span>UGX {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
