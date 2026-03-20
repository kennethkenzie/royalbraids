import React from "react";
import prisma from "@/lib/prisma";
import FeaturedSectionsClient from "@/app/components/FeaturedSectionsClient";
import { MoveUp } from "lucide-react";

export const dynamic = "force-dynamic";

async function getHomeSections() {
  try {
    return await prisma.homeSection.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch home sections:", error);
    return [];
  }
}

export default async function FeaturedContentPage() {
  const sections = await getHomeSections();

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black flex items-center gap-2">
            Home Page Sections
            <span className="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2 text-[11px] font-black uppercase text-emerald-600">
              Live Content
            </span>
          </h1>
          <p className="mt-1 text-[14px] text-zinc-500">
            Design the layout of your landing page by toggling section visibility and reordering components.
          </p>
        </div>
      </div>

      <FeaturedSectionsClient initialSections={sections} />
    </div>
  );
}
