import { categoryShares, products, sourceHealth, trendSeries } from "@/lib/mock-data";
import type { Platform, Product, ProductFilters } from "@/lib/types";

const pageSize = 6;

export function getProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategories() {
  return Array.from(new Set(products.map((product) => product.category))).sort();
}

export function getPlatforms(): Platform[] {
  return ["Digital Marketplace", "E-Commerce", "TikTok"];
}

export function getDashboardData(platform?: string) {
  const scopedProducts = platform && platform !== "all"
    ? products.filter((product) => product.sourcePlatform === platform)
    : products;

  return {
    products: scopedProducts,
    trendSeries,
    categoryShares,
    sourceHealth,
    kpis: [
      { label: "Tracked Products", value: scopedProducts.length.toString(), detail: "Demo catalog records" },
      { label: "Categories", value: new Set(scopedProducts.map((product) => product.category)).size.toString(), detail: "Normalized taxonomy" },
      { label: "Data Sources", value: new Set(scopedProducts.map((product) => product.sourcePlatform)).size.toString(), detail: "Permitted or demo feeds" },
      { label: "Updated Records", value: scopedProducts.filter((product) => product.dataStatus !== "Unavailable").length.toString(), detail: "Within latest demo batch" },
    ],
  };
}

export function filterProducts(filters: ProductFilters) {
  const currentPage = Math.max(1, Number(filters.page ?? "1") || 1);
  let filtered = [...products];

  if (filters.q) {
    const query = filters.q.toLowerCase();
    filtered = filtered.filter((product) =>
      [product.title, product.category, product.author, product.sourcePlatform]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }

  if (filters.platform && filters.platform !== "all") {
    filtered = filtered.filter((product) => product.sourcePlatform === filters.platform);
  }

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((product) => product.category === filters.category);
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((product) => product.dataStatus === filters.status);
  }

  if (filters.metricType && filters.metricType !== "all") {
    filtered = filtered.filter((product) => product.metricType === filters.metricType);
  }

  if (filters.price && filters.price !== "all") {
    filtered = filtered.filter((product) => {
      if (filters.price === "unavailable") {
        return product.price === null;
      }

      if (filters.price === "under-50") {
        return product.price !== null && product.price < 50;
      }

      if (filters.price === "50-100") {
        return product.price !== null && product.price >= 50 && product.price <= 100;
      }

      return product.price !== null && product.price > 100;
    });
  }

  filtered.sort((a, b) => compareProducts(a, b, filters.sort));

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, pages);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    products: paginated,
    total: filtered.length,
    page,
    pages,
  };
}

function compareProducts(a: Product, b: Product, sort = "relevance") {
  if (sort === "popularity") {
    return (b.metricValue ?? -1) - (a.metricValue ?? -1);
  }

  if (sort === "price") {
    return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
  }

  if (sort === "updated") {
    return new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime();
  }

  return a.title.localeCompare(b.title);
}

export function getRankedProducts(platform = "all", category = "all") {
  return products
    .filter((product) => platform === "all" || product.sourcePlatform === platform)
    .filter((product) => category === "all" || product.category === category)
    .sort((a, b) => (b.metricValue ?? -1) - (a.metricValue ?? -1));
}

export function getRelatedProducts(product: Product) {
  return products
    .filter((candidate) => candidate.slug !== product.slug)
    .filter(
      (candidate) =>
        candidate.category === product.category ||
        candidate.sourcePlatform === product.sourcePlatform,
    )
    .slice(0, 3);
}

export function getProductTrend(product: Product) {
  const base = product.metricValue ?? 24;
  return trendSeries.map((point, index) => ({
    date: point.date,
    value: Math.max(0, Math.round(base * (0.72 + index * 0.055))),
  }));
}
