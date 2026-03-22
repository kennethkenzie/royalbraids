"use client";

import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-zinc-50 p-8 text-black">
          <ShoppingBag size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-[24px] font-bold uppercase tracking-tight text-black">Your cart is empty</h1>
        <p className="mt-2 text-zinc-500">Add products to your bag to continue to checkout.</p>
        <Link
          href="/products"
          className="mt-8 rounded-full bg-black px-10 py-4 text-[14px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:py-20">
      <div className="mb-12 flex items-center gap-4">
        <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-100 bg-white shadow-sm transition hover:bg-zinc-50">
          <ChevronLeft className="h-5 w-5 text-black" />
        </Link>
        <div>
          <h1 className="text-[30px] font-black uppercase tracking-tight text-black sm:text-[40px]">Your Cart</h1>
          <p className="mt-2 text-[14px] text-zinc-500">{totalItems} item{totalItems === 1 ? "" : "s"} in your bag.</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="space-y-4">
          {cart.map((item) => (
            <article key={item.cartKey} className="flex gap-4 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">
              <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-zinc-50 sm:h-32 sm:w-28">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-100 font-bold uppercase text-zinc-300">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[16px] font-bold uppercase tracking-tight text-black">{item.name}</h2>
                    {item.unitLabel ? (
                      <p className="mt-1 text-[12px] uppercase tracking-[0.2em] text-zinc-500">{item.unitLabel}</p>
                    ) : null}
                    <p className="mt-2 text-[15px] font-bold text-black">UGX {item.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartKey)}
                    className="rounded-full p-2 text-zinc-300 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-full border border-zinc-200 bg-white">
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-zinc-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-[14px] font-bold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-zinc-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-[16px] font-black text-black">UGX {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl lg:sticky lg:top-10">
          <h2 className="text-[20px] font-bold uppercase tracking-tight text-black">Order Summary</h2>

          <div className="mt-8 space-y-4 text-[14px]">
            <div className="flex justify-between text-zinc-500">
              <span className="uppercase tracking-widest">Items</span>
              <span className="font-bold text-black">{totalItems}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span className="uppercase tracking-widest">Subtotal</span>
              <span className="font-bold text-black">UGX {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span className="uppercase tracking-widest">Delivery</span>
              <span className="font-bold text-emerald-600">Calculated at checkout</span>
            </div>
            <div className="flex justify-between border-t border-zinc-100 pt-4 text-[22px] font-black text-black">
              <span className="uppercase tracking-tight">Total</span>
              <span>UGX {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/checkout"
              className="flex h-14 w-full items-center justify-center rounded-full bg-black text-[14px] font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-200 text-[14px] font-bold uppercase tracking-widest text-black transition hover:bg-zinc-50"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
