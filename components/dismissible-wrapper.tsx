"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function DismissibleWrapper({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  
  if (!visible) return null;
  
  return (
    <div className="relative group">
      <button 
        onClick={() => setVisible(false)} 
        title="Sembunyikan kartu ini"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-red-950/30"
      >
        <X className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
}
