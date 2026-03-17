"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  Upload, 
  Plus, 
  X, 
  Check, 
  Settings2,
  Palette
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions";
import { cloudinaryImages } from "@/lib/cloudinary";

// Mock data from our other management pages
const availableColors = [
  { id: 1, name: "Jet Black", hex: "#000000" },
  { id: 2, name: "Dark Brown", hex: "#3D2B1F" },
  { id: 3, name: "Auburn", hex: "#722620" },
  { id: 4, name: "Honey Blonde", hex: "#D4AF37" },
  { id: 5, name: "Platinum", hex: "#E5E4E2" },
  { id: 6, name: "Copper", hex: "#B87333" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Braids");
  const [variations, setVariations] = useState([{ id: 1, name: "Length", value: "24 inch" }]);
  const [selectedColors, setSelectedColors] = useState<number[]>([1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: "", value: "" }]);
  };

  const removeVariation = (id: number) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const toggleColor = (id: number) => {
    setSelectedColors(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    if (!name || !price || !stock) {
      setMessage({ type: "error", text: "Please fill in all required fields (Name, Price, Stock)." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const formData = {
      name,
      description,
      price: Math.round(parseFloat(price) * 100), // Convert to cents or keep as whole if appropriate for UGX
      stock,
      category,
      colors: availableColors.filter(c => selectedColors.includes(c.id)),
      variations: variations.map(v => ({ name: v.name, value: v.value })),
      status: "Active",
      image: cloudinaryImages.productOne,
    };

    const result = await createProduct(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Product published successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 2000);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to publish product." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] space-y-8 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/products" 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white transition-all hover:bg-zinc-50"
          >
            <ChevronLeft className="h-5 w-5 text-black" />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-black font-sans">Add New Product</h1>
            <p className="text-[14px] text-zinc-500">Create a new item in your catalog.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 rounded-xl border border-zinc-200 bg-white px-6 text-[14px] font-medium text-black hover:bg-zinc-50">
            Save as Draft
          </button>
          <button 
            onClick={handlePublish}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-black px-6 text-[14px] font-bold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-[14px] font-medium border ${
          message.type === "success" 
            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
            : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: General Info & Variations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-black mb-6">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2 font-sans uppercase tracking-widest">Product Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Knotless Braids Medium"
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2 font-sans uppercase tracking-widest">Description</label>
                <textarea 
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this product..."
                  className="w-full rounded-xl bg-zinc-50 p-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Variations Section */}
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-black" />
                <h3 className="text-[16px] font-bold text-black">Product Variations</h3>
              </div>
              <button 
                onClick={addVariation}
                className="flex items-center gap-1.5 text-[13px] font-bold text-black hover:opacity-70 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Add Variation
              </button>
            </div>
            
            <div className="space-y-4">
              {variations.map((v, idx) => (
                <div key={v.id} className="flex flex-col gap-4 p-4 rounded-xl bg-zinc-50/50 border border-zinc-100 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 pl-1">Type</label>
                    <input 
                      type="text" 
                      value={v.name}
                      onChange={(e) => {
                        const newV = [...variations];
                        newV.find(item => item.id === v.id)!.name = e.target.value;
                        setVariations(newV);
                      }}
                      placeholder="e.g. Length"
                      className="w-full h-10 rounded-lg bg-white border border-zinc-200 px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 pl-1">Value</label>
                    <input 
                      type="text" 
                      value={v.value}
                      onChange={(e) => {
                        const newV = [...variations];
                        newV.find(item => item.id === v.id)!.value = e.target.value;
                        setVariations(newV);
                      }}
                      placeholder="e.g. 24 inch"
                      className="w-full h-10 rounded-lg bg-white border border-zinc-200 px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <button 
                    onClick={() => removeVariation(v.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-zinc-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}

              {variations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-zinc-100 rounded-xl">
                  <p className="text-[13px] text-zinc-400">No variations added yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-black mb-6">Pricing & Stock</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Base Price (UGX)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Total Stock</label>
                <input 
                  type="number" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Organization & Images & Colors */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-black" />
              <h3 className="text-[16px] font-bold text-black">Product Colors</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {availableColors.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                return (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={`group relative flex flex-col items-center gap-2 rounded-xl p-2 transition-all ${
                      isSelected 
                        ? "bg-zinc-900 ring-2 ring-zinc-900 ring-offset-2" 
                        : "bg-zinc-50 hover:bg-zinc-100"
                    }`}
                  >
                    <div 
                      className="h-10 w-10 rounded-lg border border-white/20 shadow-sm flex items-center justify-center transition-transform group-active:scale-90"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <Check className={`h-4 w-4 ${color.hex === "#E5E4E2" ? "text-black" : "text-white"}`} />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-tight text-center ${isSelected ? "text-white" : "text-zinc-500"}`}>
                      {color.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-black mb-6">Product Image</h3>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl p-8 bg-zinc-50/50 hover:bg-zinc-50 transition-all cursor-pointer group">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="mt-4 text-[13px] font-medium text-black">Click to upload</p>
              <p className="mt-1 text-[12px] text-zinc-500 text-center">PNG, JPG or WEBP (Max. 5MB)</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-black mb-6">Organization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 px-4 text-[14px] outline-none border border-transparent focus:border-black/10 focus:bg-white appearance-none transition-all"
                >
                  <option>Braids</option>
                  <option>Crochet</option>
                  <option>Weaves</option>
                  <option>Closure</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-2">Status</label>
                <div className="flex items-center gap-2 px-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[13px] text-zinc-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
