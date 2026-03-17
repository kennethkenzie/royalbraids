import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import { cloudinaryImages } from "@/lib/cloudinary";

const products = [
  { id: 1, name: "Knotless Braids - Medium", category: "Braids", price: "UGX 120,000", stock: "In Stock", status: "Active", image: cloudinaryImages.productOne },
  { id: 2, name: "Crochet Locs - Butterfly", category: "Crochet", price: "UGX 85,000", stock: "12 units", status: "Active", image: cloudinaryImages.productTwo },
  { id: 3, name: "Bohemian Curls - 24\"", category: "Weaves", price: "UGX 210,000", stock: "Out of Stock", status: "Draft", image: cloudinaryImages.productThree },
  { id: 4, name: "Silk Base Closure - 4x4", category: "Closure", price: "UGX 45,000", stock: "45 units", status: "Active", image: cloudinaryImages.productFour },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Products</h1>
          <p className="text-[14px] text-zinc-500">Manage your product catalog and inventory.</p>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
          <Plus className="h-4 w-4" />
          Add New Product
        </button>
      </div>

      {/* Table Filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="h-10 w-full rounded-xl bg-zinc-50 pl-10 pr-4 text-[14px] outline-none border border-transparent focus:border-black/5"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-100 px-4 text-[14px] font-medium text-zinc-600 hover:bg-zinc-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-100 bg-zinc-50/50">
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Product</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Category</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Price</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Stock</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                        <img src={product.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="text-[14px] font-medium text-black">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] text-zinc-500">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-black">{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[13px] ${product.stock === 'Out of Stock' ? 'text-red-500 font-medium' : 'text-zinc-500'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      product.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-zinc-400 hover:text-black transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
