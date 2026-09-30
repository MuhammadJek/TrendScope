import { AppFrame } from "@/components/app-frame";
import { MarketSearchClient } from "../market-search-client";
import { getTrackedKeywords } from "@/lib/market-actions";
import { redirect } from "next/navigation";

export function generateMetadata({ params }: { params: { platform: string } }) {
  const platform = params.platform.toUpperCase();
  return {
    title: `${platform} Analytics - TrendScope`,
    description: `Lacak tren kata kunci produk di ${platform}.`,
  };
}

export default async function PlatformResearchPage({ params }: { params: { platform: string } }) {
  const platform = params.platform.toUpperCase();
  
  if (!["SHOPEE", "AMAZON", "ENVATO"].includes(platform)) {
    redirect("/research/shopee");
  }

  const keywords = await getTrackedKeywords();
  
  // Filter keywords purely for this platform server-side or pass them all to client
  // Passing only relevant keywords is better
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
