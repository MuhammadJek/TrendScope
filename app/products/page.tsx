import Link from "next/link";
import { Grid3X3, List, RotateCcw } from "lucide-react";
import { AppFrame } from "@/components/app-frame";
import { DemoDataBanner } from "@/components/demo-data-banner";
import { EmptyState } from "@/components/empty-state";
import { ProductFilters } from "@/components/filters";
import { ProductCard } from "@/components/product-card";
import { ProductTable } from "@/components/product-table";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { filterProducts } from "@/lib/services";
import type { ProductFilters as ProductFilterType } from "@/lib/types";

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const filters: ProductFilterType = {
    q: stringParam(params.q),
    platform: stringParam(params.platform),
    category: stringParam(params.category),
    status: stringParam(params.status),
    metricType: stringParam(params.metricType),
    price: stringParam(params.price),
    sort: stringParam(params.sort),
    page: stringParam(params.page),
    view: stringParam(params.view),
  };
  const result = filterProducts(filters);
  const view = filters.view === "table" ? "table" : "grid";

  return (
    <AppFrame title="Product Explorer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Product Explorer</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Search and filter local mock records by source, category, price, status, and metric type.</p>
        </div>
        <DemoDataBanner />
        <form className="grid gap-4 lg:grid-cols-[18rem_1fr]" action="/products">
          <ProductFilters values={filters} />
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-3 xl:grid-cols-[1fr_12rem_10rem_auto]">
                <SearchCommand defaultValue={filters.q ?? ""} />
                <label className="sr-only" htmlFor="sort">Sort</label>
                <Select id="sort" name="sort" defaultValue={filters.sort ?? "relevance"}>
                  <option value="relevance">Relevance</option>
                  <option value="popularity">Popularity metric</option>
                  <option value="price">Price</option>
                  <option value="updated">Recently updated</option>
                </Select>
                <Select name="view" defaultValue={view} aria-label="View mode">
                  <option value="grid">Grid view</option>
                  <option value="table">Table view</option>
                </Select>
                <Button type="submit">Apply filters</Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                <span>{result.total} matching demo records</span>
                <div className="flex items-center gap-2">
                  <Link className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-300" href={{ pathname: "/products", query: { ...filters, view: "grid", page: "1" } }}>
                    <Grid3X3 className="h-4 w-4" aria-hidden="true" /> Grid
                  </Link>
                  <Link className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-300" href={{ pathname: "/products", query: { ...filters, view: "table", page: "1" } }}>
                    <List className="h-4 w-4" aria-hidden="true" /> Table
                  </Link>
                  <Link className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-teal-700 dark:text-slate-300" href="/products">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
                  </Link>
                </div>
              </div>
            </div>
            {result.products.length === 0 ? (
              <EmptyState title="No demo products found" description="Try widening the platform, category, data status, or price filters." actionHref="/products" />
            ) : view === "table" ? (
              <ProductTable products={result.products} />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {result.products.map((product) => <ProductCard key={product.slug} product={product} />)}
              </div>
            )}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
              <span>Page {result.page} of {result.pages}</span>
              <div className="flex gap-2">
                <Button href={{ pathname: "/products", query: { ...filters, page: String(Math.max(1, result.page - 1)) } }} variant="secondary" size="sm">Previous</Button>
                <Button href={{ pathname: "/products", query: { ...filters, page: String(Math.min(result.pages, result.page + 1)) } }} variant="secondary" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppFrame>
  );
}

function stringParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
