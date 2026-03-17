import React from "react";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight
} from "lucide-react";

const stats = [
  { name: "Total Products", value: "24", icon: Package, change: "+12%", changeType: "increase" },
  { name: "Total Orders", value: "156", icon: ShoppingCart, change: "+18%", changeType: "increase" },
  { name: "Total Customers", value: "842", icon: Users, change: "+5%", changeType: "increase" },
  { name: "Net Profit", value: "UGX 12,450", icon: TrendingUp, change: "+24%", changeType: "increase" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[24px] font-bold text-black">Dashboard Overview</h1>
        <p className="text-[14px] text-zinc-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-2xl border border-zinc-100 bg-white p-6 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-zinc-50 p-2.5">
                <stat.icon className="h-5 w-5 text-black" />
              </div>
              <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                {stat.change}
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-[14px] font-medium text-zinc-500">{stat.name}</h3>
              <p className="mt-1 text-[24px] font-bold text-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts or recent activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-zinc-100 bg-white p-6 min-h-[400px]">
          <h3 className="text-[16px] font-bold text-black">Sales Analytics</h3>
          <div className="mt-8 flex h-[280px] items-center justify-center rounded-xl bg-zinc-50 italic text-zinc-400">
            Analytics chart visualization placeholder...
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-6">
          <h3 className="text-[16px] font-bold text-black">Recent Activity</h3>
          <div className="mt-6 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-100" />
                <div className="space-y-1">
                  <p className="text-[13px] font-medium text-black">New order placed #ORD-{1000 + i}</p>
                  <p className="text-[12px] text-zinc-500">24 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
