export type MarketplaceSource = "AMAZON" | "EBAY" | "ETSY" | "ENVATO";

export type DataStatus = "OBSERVED" | "ESTIMATED" | "UNAVAILABLE" | "FIXTURE";

export interface NormalizedProductListing {
  id: string; // unique internal key e.g. "ebay:v1|123456"
  externalId: string;
  source: MarketplaceSource;
  title: string;
  thumbnailUrl: string | null;
  originalUrl: string | null;
  price: number;
  currency: string;
  category: string;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "LIMITED" | "UNKNOWN";
  rating: number | null;
  reviewCount: number | null;
  sellerName: string | null;
  historicalPrices?: { price: number; recordedAt: string }[];
  trendMomentum: "STRONG_UP" | "MODERATE_UP" | "STABLE" | "DECLINING";
  competitionIndicator: "LOW" | "MEDIUM" | "HIGH";
  opportunityScore: number; // 0 - 100
  lastObservedAt: string;
  dataStatus: DataStatus;
}

export interface MarketplaceSearchParams {
  query: string;
  category?: string;
  country?: string; // e.g. "US"
  limit?: number;
  offset?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface MarketplaceSearchResult {
  source: MarketplaceSource;
  query: string;
  totalResults: number;
  offset: number;
  limit: number;
  items: NormalizedProductListing[];
  dataStatus: DataStatus;
  statusMessage?: string;
}

export interface MarketplaceProviderHealth {
  status: "CONNECTED" | "UNCONFIGURED" | "RATE_LIMITED" | "ERROR";
  message: string;
  latencyMs?: number;
}

export interface IMarketplaceProvider {
  readonly id: MarketplaceSource;
  readonly name: string;
  checkHealth(): Promise<MarketplaceProviderHealth>;
  search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult>;
  getProduct(externalId: string): Promise<NormalizedProductListing | null>;
}
