"use client";

import { motion } from "framer-motion";
import { Play, Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";

// Utility to format large numbers (e.g., 1500000 -> 1.5M)
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

interface VideoListProps {
  videos: any[];
}

export default function VideoList({ videos }: VideoListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {videos.map((video, idx) => (
        <motion.div
          key={video.videoId ?? idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] hover:border-slate-300 dark:hover:border-slate-700 transition-colors group flex flex-col h-full">
            <div className="p-5 flex-1 flex flex-col">
              {/* Header: Rank & Creator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px] text-sm">
                      @{video.authorName}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                  #{idx + 1}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-5 flex-1 leading-relaxed">
                {video.description}
              </p>

              {/* Metrics inline */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Play className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatNumber(video.viewsCount)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatNumber(video.likesCount)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatNumber(video.commentsCount)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatNumber(video.sharesCount)}</span>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="p-4 pt-0">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Lihat Video <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}


