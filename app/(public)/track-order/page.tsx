"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getOrder } from "@/lib/actions";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Loader2,
  ChevronRight,
  Phone
} from "lucide-react";
import Link from "next/link";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");
  const isSuccess = searchParams.get("success") === "true";

  const [orderNumber, setOrderNumber] = useState(orderNumberParam || "");
  const [order, setOrder] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!orderNumberParam);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderNumberParam) {
      handleSearch(undefined, orderNumberParam);
    }
  }, [orderNumberParam]);

  const handleSearch = async (e?: React.FormEvent, manualOrderNumber?: string) => {
    if (e) e.preventDefault();
    const targetOrderNumber = manualOrderNumber || orderNumber;
    
    if (!targetOrderNumber) return;

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await getOrder(targetOrderNumber);
      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setError("Order not found. Please check the order number and try again.");
      }
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setIsSearching(false);
    }
  };

  const steps = [
    { status: "Pending", icon: Clock, label: "Order Placed", description: "We've received your order and are preparing it." },
    { status: "Shipped", icon: Truck, label: "Out for Delivery", description: "Your premium braids are on the way to your doorstep." },
    { status: "Delivered", icon: CheckCircle2, label: "Delivered", description: "Package has been delivered. Enjoy your Royal touch!" },
  ];

  const currentStepIndex = order ? steps.findIndex(s => s.status === order.status) : 0;

  return (
    <div className="mx-auto max-w-[900px] px-6 py-12 md:py-24">
      {isSuccess && !error && order && (
        <div className="mb-12 rounded-3xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-100 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-[24px] font-black text-emerald-900 uppercase tracking-tight">Order Placed Successfully!</h1>
          <p className="mt-2 text-emerald-700">Thank you, {order.customerName}. Your order <span className="font-bold underline">#{order.orderNumber}</span> is being processed.</p>
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-[32px] font-black text-black uppercase tracking-tight leading-none">Track Your Order</h2>
        <p className="mt-3 text-zinc-500">Enter your order number to see the current status of your delivery.</p>
        
        <form onSubmit={handleSearch} className="mt-8 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="e.g. RB-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="h-14 w-full rounded-2xl border border-transparent bg-zinc-50 pl-12 pr-4 text-[15px] font-medium outline-none transition-all focus:border-black/10 focus:bg-white focus:ring-4 focus:ring-black/5"
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching || !orderNumber}
            className="flex h-14 items-center justify-center rounded-2xl bg-black px-8 text-[15px] font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Track"}
          </button>
        </form>
      </div>

      {hasSearched && !isSearching && !order && error && (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
          <p className="text-[16px] font-medium text-zinc-600">{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Status Tracker */}
          <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">Order Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <h3 className="text-[20px] font-bold text-black uppercase">{order.status}</h3>
                  <div className={`h-2 w-2 rounded-full animate-pulse ${order.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400">Estimated Delivery</span>
                <p className="mt-1 text-[16px] font-bold text-black">Today, 5:00 PM</p>
              </div>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-[19px] top-0 h-full w-[2px] bg-zinc-100 md:left-0 md:top-[19px] md:h-[2px] md:w-full" />
              <div 
                className="absolute left-[19px] top-0 w-[2px] bg-black transition-all duration-1000 md:left-0 md:top-[19px] md:h-[2px]" 
                style={{ 
                  height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '2px',
                  width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '2px'
                }}
              />

              <div className="relative flex flex-col gap-10 md:flex-row md:justify-between md:gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div key={step.status} className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white transition-colors duration-500 ${isCompleted ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="md:mt-2">
                        <p className={`text-[14px] font-bold uppercase tracking-tight ${isCompleted ? 'text-black' : 'text-zinc-400'}`}>{step.label}</p>
                        <p className="mt-1 text-[12px] text-zinc-500 max-w-[150px]">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Delivery Details */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
              <h4 className="mb-6 flex items-center gap-2 text-[16px] font-bold text-black uppercase tracking-tight">
                <MapPin className="h-4 w-4" />
                Delivery Details
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Customer</p>
                  <p className="text-[15px] font-medium text-black">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Ship To</p>
                  <p className="text-[15px] font-medium text-black">{order.address}, {order.city}</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Contact</p>
                  <div className="flex items-center gap-2 text-[15px] font-medium text-black">
                    <Phone className="h-3 w-3" />
                    {order.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
              <h4 className="mb-6 flex items-center gap-2 text-[16px] font-bold text-black uppercase tracking-tight">
                <ShoppingBag className="h-4 w-4" />
                Items Ordered
              </h4>
              <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-zinc-50 pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-50">
                        {item.image && <img src={item.image} className="h-full w-full object-cover" />}
                      </div>
                      <p className="text-[13px] font-medium text-black line-clamp-1">{item.name}</p>
                    </div>
                    <span className="text-[13px] font-bold text-zinc-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-zinc-50 pt-4 flex justify-between">
                <span className="text-[14px] font-bold uppercase text-black">Total Paid</span>
                <span className="text-[16px] font-black text-black">UGX {order.totalCents?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
