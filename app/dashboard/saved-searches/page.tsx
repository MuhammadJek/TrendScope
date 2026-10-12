import { AppFrame } from "@/components/app-frame";
import { getSavedSearches } from "@/lib/search-actions";
import { Bookmark, ExternalLink, Activity } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = {
  title: "Saved Searches — TrendScope",
};

export default async function SavedSearchesPage() {
  const searches = await getSavedSearches();

  return (
    <AppFrame title="Saved Searches">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-pink-500" />
            Tracked Keywords
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Kelola keyword dan hashtag yang sedang Anda pantau performanya.
          </p>
        </div>

        {searches.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Belum ada keyword tersimpan</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Cari keyword di TikTok Analytics dan tekan "Track Keyword" untuk menyimpannya di sini.
            </p>
            <Link 
              href="/research/tiktok"
              className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-medium transition-colors"
            >
              Mulai Pencarian
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searches.map((search) => (
              <Link 
                key={search.id} 
                href={`/research/tiktok/result/${encodeURIComponent(search.keyword)}`}
                className="group"
              >
                <Card className="h-full border-slate-200 dark:border-slate-800 hover:border-pink-500/50 dark:hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        #{search.keyword}
                      </CardTitle>
                      <p className="text-xs text-slate-500 mt-1 capitalize font-medium">
                        Platform: {search.provider.toLowerCase()}
                      </p>
                    </div>
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30 transition-colors">
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Activity className="w-4 h-4" />
                      <span>
                        Ditambahkan {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true, locale: id })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppFrame>
  );
}

