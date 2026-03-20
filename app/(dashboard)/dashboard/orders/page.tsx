import React from "react";
import { ShoppingCart, Clock, PackageCheck, AlertCircle } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Orders</h1>
          <p className="text-[14px] text-zinc-500">
            Monitor and manage customer transactions.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-12 shadow-sm">
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-zinc-50 p-6">
            <ShoppingCart className="h-10 w-10 text-zinc-300" />
          </div>
          <h2 className="text-[20px] font-bold text-black">
            Order system under maintenance
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
            We are currently upgrading the order management system to provide better tracking and fulfillment analytics. This module will be live shortly.
          </p>
          
          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-50 bg-zinc-50/50 p-4">
              <Clock className="h-5 w-5 text-zinc-400 mx-auto" />
              <p className="mt-2 text-[12px] font-semibold text-zinc-600 uppercase tracking-widest">Expected Live</p>
              <p className="text-[14px] font-bold text-black mt-1">Coming Soon</p>
            </div>
            <div className="rounded-xl border border-zinc-50 bg-zinc-50/50 p-4">
              <PackageCheck className="h-5 w-5 text-zinc-400 mx-auto" />
              <p className="mt-2 text-[12px] font-semibold text-zinc-600 uppercase tracking-widest">Features</p>
              <p className="text-[14px] font-bold text-black mt-1">Live Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
