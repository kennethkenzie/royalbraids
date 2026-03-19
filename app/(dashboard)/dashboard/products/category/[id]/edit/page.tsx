import prisma from "@/lib/prisma";
import { updateCategory } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Image } from "lucide-react";
import { notFound } from "next/navigation";
import CategoryBannerField from "@/app/components/CategoryBannerField";
import CategoryCircleImageField from "@/app/components/CategoryCircleImageField";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = parseInt(idParam);
  if (isNaN(id)) notFound();

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) notFound();

  async function updateWithId(formData: FormData) {
    "use server";
    await updateCategory(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products/category"
          className="flex items-center gap-2 text-[14px] text-zinc-500 hover:text-black transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
      </div>

      <div>
        <h1 className="text-[24px] font-bold text-black">Edit Category</h1>
        <p className="text-[14px] text-zinc-500 mt-1">
          Update the banner image and featured status for <strong>{category.name}</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit Form */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <form action={updateWithId} className="space-y-6">
            <div>
              <label className="block text-[13px] font-semibold text-zinc-700 mb-1">Category Name</label>
              <p className="h-11 flex items-center rounded-xl bg-zinc-50 px-4 text-[14px] text-zinc-500 border border-zinc-100">
                {category.name}
              </p>
              <p className="mt-1 text-[11px] text-zinc-400">Name cannot be changed here</p>
            </div>

            <CategoryBannerField defaultValue={category.banner ?? ""} />
            <CategoryCircleImageField defaultValue={(category as any).circleImage ?? ""} />

            <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-4">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                defaultChecked={category.isFeatured}
                className="mt-0.5 h-4 w-4 rounded border-amber-300 accent-amber-500"
              />
              <div>
                <label htmlFor="isFeatured" className="block text-[14px] font-semibold text-amber-800 cursor-pointer">
                  Feature on Homepage
                </label>
                <p className="text-[12px] text-amber-700 mt-0.5">
                  Displays a dedicated section on the homepage with this category's banner and products.
                  Requires a banner image to be set.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-black text-[14px] font-medium text-white hover:bg-zinc-800 transition-all"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Category Info */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm h-fit space-y-4">
          <h3 className="text-[15px] font-bold text-black">Category Info</h3>
          <div className="space-y-3 text-[14px]">
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Name</span>
              <span className="font-medium text-black">{category.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Slug</span>
              <span className="font-mono text-[12px] text-zinc-600">/{category.slug}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Products</span>
              <span className="font-medium text-black">{category._count.products}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-50">
              <span className="text-zinc-500">Featured</span>
              <span className={`font-medium ${category.isFeatured ? "text-amber-600" : "text-zinc-400"}`}>
                {category.isFeatured ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Banner</span>
              <span className={`font-medium ${category.banner ? "text-emerald-600" : "text-zinc-400"}`}>
                {category.banner ? "Set" : "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-500">Circle Image</span>
              <span className={`font-medium ${(category as any).circleImage ? "text-emerald-600" : "text-zinc-400"}`}>
                {(category as any).circleImage ? "Set" : "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
