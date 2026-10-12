import { AppFrame } from "@/components/app-frame";
import { MarketSearchClient } from "../market-search-client";
import { getTrackedKeywords } from "@/lib/market-actions";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ platform: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform.toUpperCase();
  return {
    title: `${platform} Analytics - TrendScope`,
    description: `Lacak tren kata kunci produk di ${platform}.`,
  };
}

export default async function PlatformResearchPage({ params }: Props) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform.toUpperCase();
  
  if (platform === "SHOPEE") {
    redirect("/research/shopee");
  }

  if (!["AMAZON", "ENVATO", "ETSY", "EBAY"].includes(platform)) {
    redirect("/research/amazon");
  }

  const keywords = await getTrackedKeywords();
  const platformKeywords = keywords.filter(k => k.platform === platform);

  return (
    <AppFrame title={`${platform} Analytics`}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50 capitalize">
            {platform.toLowerCase()} Analytics
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Lacak pergerakan harga, kompetisi, dan estimasi penjualan khusus untuk platform {platform}.
          </p>
        </div>
        
        <MarketSearchClient initialKeywords={platformKeywords} activePlatform={platform} />
      </div>
    </AppFrame>
  );
}

