"use client";

import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  Upload,
  Plus,
  X,
  Check,
  Settings2,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions";

const availableColors = [
  { id: 1, name: "Jet Black", hex: "#000000" },
  { id: 2, name: "Dark Brown", hex: "#3D2B1F" },
  { id: 3, name: "Auburn", hex: "#722620" },
  { id: 4, name: "Honey Blonde", hex: "#D4AF37" },
  { id: 5, name: "Platinum", hex: "#E5E4E2" },
  { id: 6, name: "Copper", hex: "#B87333" },
];

type ProductFormData = {
  id?: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  status?: string;
  variations: Array<{ id: number; name: string; value: string }>;
  selectedColors: number[];
  imageUrl: string;
};

type ProductEditorFormProps = {
  mode: "create" | "edit";
  initialData?: ProductFormData;
};

const defaultProduct: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Braids",
  status: "Active",
  variations: [{ id: 1, name: "Length", value: "24 inch" }],
  selectedColors: [1],
  imageUrl: "",
};

export default function ProductEditorForm({
  mode,
  initialData,
}: ProductEditorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const product = initialData || defaultProduct;

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category);
  const [status] = useState(product.status || "Active");
  const [variations, setVariations] = useState(product.variations);
  const [selectedColors, setSelectedColors] = useState<number[]>(
    product.selectedColors
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [imageName, setImageName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const addVariation = () => {
    setVariations([...variations, { id: Date.now(), name: "", value: "" }]);
  };

  const removeVariation = (id: number) => {
    setVariations(variations.filter((variation) => variation.id !== id));
  };

  const toggleColor = (id: number) => {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((colorId) => colorId !== id) : [...prev, id]
    );
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setMessage({
        type: "error",
        text: "Cloudinary upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your environment.",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose a valid image file." });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be 5MB or smaller." });
      event.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: payload }
      );

      const data = await response.json();
      if (!response.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Image upload failed.");
      }

      setImageUrl(data.secure_url);
      setImageName(file.name);
      setMessage({ type: "success", text: "Image uploaded successfully." });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Image upload failed.";
      setImageUrl("");
      setImageName("");
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields (Name, Price, Stock).",
      });
      return;
    }

    if (!imageUrl) {
      setMessage({
        type: "error",
        text: "Please upload a product image before saving.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      id: product.id,
      name,
      description,
      price: Math.round(parseFloat(price || "0") * 100),
      stock,
      category,
      colors: availableColors.filter((color) => selectedColors.includes(color.id)),
      variations: variations.map((variation) => ({
        name: variation.name,
        value: variation.value,
      })),
      status,
      image: imageUrl,
    };

    const result =
      mode === "edit" ? await updateProduct(payload) : await createProduct(payload);

    if (result.success) {
      setMessage({
        type: "success",
        text:
          mode === "edit"
            ? "Product updated successfully! Redirecting..."
            : "Product published successfully! Redirecting...",
      });
      setTimeout(() => {
        router.push("/dashboard/products");
        router.refresh();
      }, 1200);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to save product.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] space-y-8 pb-20 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white transition-all hover:bg-zinc-50"
          >
            <ChevronLeft className="h-5 w-5 text-black" />
          </Link>
          <div>
            <h1 className="font-sans text-[24px] font-bold text-black">
              {mode === "edit" ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-[14px] text-zinc-500">
              {mode === "edit"
                ? "Update an item in your catalog."
                : "Create a new item in your catalog."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="flex h-11 items-center rounded-xl border border-zinc-200 bg-white px-6 text-[14px] font-medium text-black hover:bg-zinc-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-black px-6 text-[14px] font-bold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? mode === "edit"
                ? "Saving..."
                : "Publishing..."
              : mode === "edit"
                ? "Save Changes"
                : "Publish Product"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl border p-4 text-[14px] font-medium ${
            message.type === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              General Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-sans text-[13px] font-medium uppercase tracking-widest text-zinc-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Knotless Braids Medium"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block font-sans text-[13px] font-medium uppercase tracking-widest text-zinc-700">
                  Description
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this product..."
                  className="w-full resize-none rounded-xl border border-transparent bg-zinc-50 p-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-black" />
                <h3 className="text-[16px] font-bold text-black">
                  Product Variations
                </h3>
              </div>
              <button
                onClick={addVariation}
                className="flex items-center gap-1.5 text-[13px] font-bold text-black transition-opacity hover:opacity-70"
              >
                <Plus className="h-4 w-4" />
                Add Variation
              </button>
            </div>

            <div className="space-y-4">
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className="flex flex-col gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 sm:flex-row sm:items-end"
                >
                  <div className="flex-1">
                    <label className="mb-1.5 block pl-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Type
                    </label>
                    <input
                      type="text"
                      value={variation.name}
                      onChange={(e) => {
                        const next = [...variations];
                        const target = next.find((item) => item.id === variation.id);
                        if (target) target.name = e.target.value;
                        setVariations(next);
                      }}
                      placeholder="e.g. Length"
                      className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <div className="flex-[2]">
                    <label className="mb-1.5 block pl-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Value
                    </label>
                    <input
                      type="text"
                      value={variation.value}
                      onChange={(e) => {
                        const next = [...variations];
                        const target = next.find((item) => item.id === variation.id);
                        if (target) target.value = e.target.value;
                        setVariations(next);
                      }}
                      placeholder="e.g. 24 inch"
                      className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-[13px] outline-none focus:border-black/20"
                    />
                  </div>
                  <button
                    onClick={() => removeVariation(variation.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              Pricing & Stock
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Base Price (UGX)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Total Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
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
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 shadow-sm transition-transform group-active:scale-90"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`h-4 w-4 ${
                            color.hex === "#E5E4E2" ? "text-black" : "text-white"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-center text-[10px] font-bold uppercase tracking-tight ${
                        isSelected ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      {color.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              Product Image
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="group flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-8 transition-all hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                <Upload className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="mt-4 text-[13px] font-medium text-black">
                {isUploadingImage ? "Uploading image..." : "Click to upload"}
              </p>
              <p className="mt-1 text-center text-[12px] text-zinc-500">
                PNG, JPG or WEBP (Max. 5MB)
              </p>
            </button>

            {imageUrl && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
                <img
                  src={imageUrl}
                  alt={imageName || name || "Uploaded product preview"}
                  className="h-56 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="min-w-0 flex-1 truncate text-[12px] text-zinc-600">
                    {imageName || "Current product image"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setImageName("");
                    }}
                    className="text-[12px] font-medium text-black hover:opacity-70"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-[16px] font-bold text-black">
              Organization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10 focus:bg-white"
                >
                  <option>Braids</option>
                  <option>Crochet</option>
                  <option>Weaves</option>
                  <option>Closure</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Status
                </label>
                <div className="flex items-center gap-2 px-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[13px] text-zinc-600">
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
