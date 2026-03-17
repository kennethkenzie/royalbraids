"use client";

import React from "react";
import { Plus, Search, MoreVertical, Tag } from "lucide-react";

const categories = [
  { id: 1, name: "Braids", slug: "braids", products: 12, status: "Active" },
  { id: 2, name: "Crochet", slug: "crochet", products: 8, status: "Active" },
  { id: 3, name: "Weaves", slug: "weaves", products: 15, status: "Active" },
  { id: 4, name: "Closure", slug: "closure", products: 6, status: "Active" },
  { id: 5, name: "Accessories", slug: "accessories", products: 24, status: "Active" },
];

export default function CategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Product Categories</h1>
          <p className="text-[14px] text-zinc-500">Organize your products into logical groups.</p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  className="w-full h-10 rounded-xl bg-zinc-50 pl-10 pr-4 text-[13px] outline-none border border-transparent focus:border-black/5"
                />
              </div>
            </div>
            
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Category Name</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Products</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-zinc-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                          <Tag className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-black">{cat.name}</p>
                          <p className="text-[12px] text-zinc-400">/{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-zinc-600">{cat.products} products</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-zinc-400 hover:text-black">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Add Form */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm h-fit">
          <h3 className="text-[16px] font-bold text-black mb-6">Create Category</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">Name</label>
              <input 
                type="text" 
                placeholder="Category name"
                className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">Slug</label>
              <input 
                type="text" 
                placeholder="category-slug"
                className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 transition-all"
              />
            </div>
            <button className="w-full h-11 rounded-xl bg-zinc-900 border border-black text-[14px] font-medium text-white hover:bg-black transition-all">
              Save Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
