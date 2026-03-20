import React from "react";
import { Layout, Save } from "lucide-react";

export default function FeaturedContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-black">Featured Sections</h1>
        <p className="mt-1 text-[14px] text-zinc-500">
          Manage the placement and visibility of home page promotional sections.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-100 bg-white p-12 shadow-sm">
        <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-zinc-50 p-6">
            <Layout className="h-10 w-10 text-zinc-300" />
          </div>
          <h2 className="text-[20px] font-bold text-black">
            Section Layout Configurator
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
            Customize the order of Shop Categories, Must-Haves, and Featured Banners here. This configurator is coming in the next update.
          </p>
          
          <button className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-black px-6 text-[14px] font-medium text-white transition hover:bg-zinc-800">
            <Save className="h-4 w-4" />
            Enable Reordering
          </button>
        </div>
      </div>
    </div>
  );
}
