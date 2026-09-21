import { SlidersHorizontal } from "lucide-react";
import { getCategories, getPlatforms } from "@/lib/services";
import { Select } from "@/components/ui/select";

export function PlatformFilter({ defaultValue = "all" }: { defaultValue?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      Platform
      <Select name="platform" defaultValue={defaultValue}>
        <option value="all">All platforms</option>
        {getPlatforms().map((platform) => (
          <option key={platform} value={platform}>{platform}</option>
        ))}
      </Select>
    </label>
  );
}

export function CategoryFilter({ defaultValue = "all" }: { defaultValue?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      Category
      <Select name="category" defaultValue={defaultValue}>
        <option value="all">All categories</option>
        {getCategories().map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>
    </label>
  );
}

export function DateRangePicker({ defaultValue = "30d" }: { defaultValue?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      Date range
      <Select name="range" defaultValue={defaultValue}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </Select>
    </label>
  );
}

export function ProductFilters({
  values,
}: {
  values: Record<string, string | undefined>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center gap-2 font-semibold text-slate-950 dark:text-slate-50">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filters
      </div>
      <div className="grid gap-4">
        <PlatformFilter defaultValue={values.platform ?? "all"} />
        <CategoryFilter defaultValue={values.category ?? "all"} />
        <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Price range
          <Select name="price" defaultValue={values.price ?? "all"}>
            <option value="all">Any price</option>
            <option value="under-50">Under $50</option>
            <option value="50-100">$50 to $100</option>
            <option value="over-100">Over $100</option>
            <option value="unavailable">Unavailable</option>
          </Select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Metric type
          <Select name="metricType" defaultValue={values.metricType ?? "all"}>
            <option value="all">Any metric</option>
            <option value="Rank">Rank</option>
            <option value="Price">Price</option>
            <option value="Engagement">Engagement</option>
            <option value="Freshness">Freshness</option>
          </Select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Data status
          <Select name="status" defaultValue={values.status ?? "all"}>
            <option value="all">Any status</option>
            <option value="Observed">Observed</option>
            <option value="Estimated">Estimated</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Demo">Demo</option>
          </Select>
        </label>
      </div>
    </div>
  );
}
