import { AppFrame } from "@/components/app-frame";
import { YouTubeSearchClient } from "./youtube-search-client";

export const metadata = {
  title: "YouTube Insights — TrendScope",
  description: "Cari video YouTube terkait kata kunci bisnis Anda.",
};

export default function YouTubePage() {
  return (
    <AppFrame title="YouTube Insights">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">
            YouTube Insights
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Cari video YouTube terkait kata kunci atau tren bisnis Anda. Lihat metrik tayangan,
            suka, dan komentar secara real-time dari YouTube Data API.
          </p>
        </div>
        <YouTubeSearchClient />
      </div>
    </AppFrame>
  );
}
