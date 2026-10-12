"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Globe,
  Layers,
  Clock,
  Search,
  Check,
  RotateCcw,
  Bookmark,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AVAILABLE_CATEGORIES,
  AVAILABLE_COUNTRIES,
  type UserDashboardPreferences,
} from "@/lib/user-preferences-constants";
import { saveUserDashboardPreferences } from "@/lib/user-preferences-actions";

interface DashboardFilterBarProps {
  initialCountry: string;
  initialCategories: string[];
  initialRange: string;
  initialQuery: string;
  isAuthenticated?: boolean;
}

export function DashboardFilterBar({
  initialCountry,
  initialCategories,
  initialRange,
  initialQuery,
  isAuthenticated = true,
}: DashboardFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [country, setCountry] = useState(initialCountry || "US");
  const [categories, setCategories] = useState<string[]>(
    initialCategories.length > 0 ? initialCategories : ["Fashion & Apparel"]
  );
  const [range, setRange] = useState(initialRange || "30d");
  const [query, setQuery] = useState(initialQuery || "");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const applyFilters = (
    nextCountry = country,
    nextCategories = categories,
    nextRange = range,
    nextQuery = query
  ) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("country", nextCountry);
    params.set("range", nextRange);
    if (nextCategories.length > 0) {
      params.set("categories", nextCategories.join(","));
    } else {
      params.delete("categories");
    }
    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const toggleCategory = (cat: string) => {
    let updated: string[];
    if (categories.includes(cat)) {
      if (categories.length === 1) return; // Keep at least one
      updated = categories.filter((c) => c !== cat);
    } else {
      updated = [...categories, cat];
    }
    setCategories(updated);
    applyFilters(country, updated, range, query);
  };

  const handleSaveDefaults = async () => {
    setSavedSuccess(false);
    const res = await saveUserDashboardPreferences({
      country,
      categories,
      timeRange: range as "24h" | "7d" | "30d" | "90d",
      searchQuery: query,
    });
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters(country, categories, range, query);
              }
            }}
            placeholder="Search product, keyword, brand, or topic across market intelligence..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-24 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-900"
          />
          <Button
            size="sm"
            onClick={() => applyFilters(country, categories, range, query)}
            disabled={isPending}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 text-xs bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            {isPending ? "Filtering..." : "Search"}
          </Button>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Target Country Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-400 dark:text-slate-500">Country:</span>
            <select
              value={country}
              onChange={(e) => {
                const next = e.target.value;
                setCountry(next);
                applyFilters(next, categories, range, query);
              }}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none dark:text-slate-100 cursor-pointer"
            >
              {AVAILABLE_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="dark:bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-400 dark:text-slate-500">Range:</span>
            <select
              value={range}
              onChange={(e) => {
                const next = e.target.value;
                setRange(next);
                applyFilters(country, categories, next, query);
              }}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none dark:text-slate-100 cursor-pointer"
            >
              <option value="24h" className="dark:bg-slate-900">Past 24 Hours</option>
              <option value="7d" className="dark:bg-slate-900">Past 7 Days</option>
              <option value="30d" className="dark:bg-slate-900">Past 30 Days</option>
              <option value="90d" className="dark:bg-slate-900">Past 90 Days</option>
            </select>
          </div>

          {/* Multi-Select Category Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>
                Categories ({categories.length})
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Personalized Categories
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Multi-select
                    </span>
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {AVAILABLE_CATEGORIES.map((cat) => {
                      const selected = categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                            selected
                              ? "bg-teal-50 text-teal-900 font-semibold dark:bg-teal-950/60 dark:text-teal-200"
                              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                          }`}
                        >
                          <span>{cat}</span>
                          {selected && (
                            <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 border-t border-slate-100 pt-2 flex justify-between dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setCategories([...AVAILABLE_CATEGORIES]);
                        applyFilters(country, [...AVAILABLE_CATEGORIES], range, query);
                      }}
                      className="text-[11px] text-teal-600 hover:underline dark:text-teal-400 font-medium"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(false)}
                      className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Persist to Account Button */}
          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDefaults}
              className={`h-8 gap-1.5 text-xs transition-all ${
                savedSuccess
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{savedSuccess ? "Preferences Saved!" : "Save Defaults"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Selected Categories Pill Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-900">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1">
          Active Focus:
        </span>
        {categories.map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
          >
            {cat}
            {categories.length > 1 && (
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                className="hover:text-rose-500 text-slate-400 ml-0.5"
                title="Remove category"
              >
                &times;
              </button>
            )}
          </span>
        ))}
        {query && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-medium text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Keyword: &quot;{query}&quot;
            <button
              type="button"
              onClick={() => {
                setQuery("");
                applyFilters(country, categories, range, "");
              }}
              className="hover:text-rose-500 text-teal-500 ml-0.5"
            >
              &times;
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
