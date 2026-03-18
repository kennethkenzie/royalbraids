import React from "react";
import { Plus, Search, Tag, Trash2, Star, Image, CheckCircle } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CategoryBannerField from "@/app/components/CategoryBannerField";

async function getCategories() {
  return await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Product Categories</h1>
          <p className="text-[14px] text-zinc-500">
            Organize your products into logical groups.
            <span className="ml-2 font-medium text-black">({categories.length} total)</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
            {categories.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="mb-3 rounded-full bg-zinc-100 p-4">
                  <Tag className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-[15px] font-medium text-black">No categories yet</p>
                <p className="text-[13px] text-zinc-500 mt-1">Create your first category to get started</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 border-b border-zinc-100">
                  <tr>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Category</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Banner</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Products</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Featured</th>
                    <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-zinc-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center overflow-hidden">
                            {cat.banner ? (
                              <img src={cat.banner} alt={cat.name} className="h-full w-full object-cover" />
                            ) : (
                              <Tag className="h-4 w-4 text-zinc-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-black">{cat.name}</p>
                            <p className="text-[11px] text-zinc-400">/{cat.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {cat.banner ? (
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Set
                          </span>
                        ) : (
                          <span className="text-[12px] text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-zinc-600">{cat._count.products}</td>
                      <td className="px-6 py-4">
                        {cat.isFeatured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">
                            <Star className="h-3 w-3 fill-amber-500" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-[12px] text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/products/category/${cat.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition"
                          >
                            <Image className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <form action={deleteCategory.bind(null, cat.id)}>
                            <button
                              type="submit"
                              disabled={cat._count.products > 0}
                              className="p-2 text-zinc-400 hover:text-red-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                              title={cat._count.products > 0 ? "Remove all products first" : "Delete category"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Add Form */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm h-fit">
          <h3 className="text-[16px] font-bold text-black mb-6">Create Category</h3>
          <form action={createCategory} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Knotless Braids"
                className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 transition-all"
              />
            </div>

            <CategoryBannerField />

            <div className="flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                className="h-4 w-4 rounded border-amber-300 accent-amber-500"
              />
              <div>
                <label htmlFor="isFeatured" className="block text-[13px] font-semibold text-amber-800 cursor-pointer">
                  Feature on Homepage
                </label>
                <p className="text-[11px] text-amber-600">
                  Shows this category's products on the home page
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-zinc-900 border border-black text-[14px] font-medium text-white hover:bg-black transition-all"
            >
              Save Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
