import { redirect } from "next/navigation";

export default async function ShopeeLegacyRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  if (resolvedParams.q) {
    redirect(`/research/shopee/result/${encodeURIComponent(resolvedParams.q)}`);
  }
  
  redirect("/research/shopee");
}

