import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import SignInForm from "@/app/components/SignInForm";
import { Loader2 } from "lucide-react";

export default async function SigninPage() {
  const settings = await (prisma as any).siteSettings.findUnique({ where: { id: 1 } });

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-200" />
      </div>
    }>
      <SignInForm logoUrl={settings?.logoUrl} />
    </Suspense>
  );
}
