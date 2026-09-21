export type Platform = "Digital Marketplace" | "E-Commerce" | "TikTok";

export type DataStatus = "Observed" | "Estimated" | "Unavailable" | "Demo";

export type MetricType = "Rank" | "Price" | "Engagement" | "Freshness";

export type Product = {
  slug: string;
  title: string;
  sourcePlatform: Platform;
  category: string;
  author?: string;
  price: number | null;
  metricName: string;
  metricValue: number | null;
  metricUnit: string;
  capturedAt: string;
  dataStatus: DataStatus;
  sourceReference: string;
  metricType: MetricType;
  description: string;
  externalUrl: string;
  change: number | null;
  color: "teal" | "indigo" | "amber" | "rose" | "slate";
};

export type TrendPoint = {
  date: string;
  marketplace: number;
  ecommerce: number;
  tiktok: number;
  total: number;
};

export type CategoryShare = {
  name: string;
  value: number;
};

export type SourceHealth = {
  source: Platform;
  status: "Fresh" | "Delayed" | "Limited";
  freshness: string;
  records: number;
};

export type ProductFilters = {
  q?: string;
  platform?: string;
  category?: string;
  status?: string;
  metricType?: string;
  price?: string;
  sort?: string;
  page?: string;
  view?: string;
};
