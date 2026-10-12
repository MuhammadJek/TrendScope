import { AppFrame } from "@/components/app-frame";
import { TiktokSearchClient } from "./tiktok-search-client";
import { TrendingUp, Users, Target } from "lucide-react";

export const metadata = {
  title: "TikTok Analytics — TrendScope",
  description: "Analisis tren TikTok berdasarkan hashtag atau keyword.",
};

export default function TiktokPage() {
  return (
    <AppFrame title="TikTok Trend Analytics">
      <div className="max-w-5xl mx-auto space-y-12 py-10 px-4 sm:px-6">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 mt-8 sm:mt-16">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-medium tracking-wide mb-4">
            AI-Powered Search
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Mata-matai Algoritma TikTok
          </h1>
          
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Temukan konten berkinerja tinggi, pantau hashtag yang sedang tren, dan analisis metrik kompetitor secara real-time.
          </p>
        </div>
        
        {/* Search Component */}
        <div className="pt-6">
          <TiktokSearchClient />
        </div>

        {/* Features / Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 mt-12 border-t border-slate-100 dark:border-slate-800/50">
          <FeatureCard 
            icon={TrendingUp} 
            title="Tren Hashtag" 
            desc="Lacak pertumbuhan tayangan dan potensi viralitas dari sebuah hashtag." 
          />
          <FeatureCard 
            icon={Users} 
            title="Analisis Engagement" 
            desc="Ketahui tingkat interaksi audiens melalui metrik yang terkalkulasi otomatis." 
          />
          <FeatureCard 
            icon={Target} 
            title="Riset Kompetitor" 
            desc="Bongkar pola konten berkinerja tinggi untuk strategi pemasaran Anda." 
          />
        </div>
        
      </div>
    </AppFrame>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-900">
        <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

