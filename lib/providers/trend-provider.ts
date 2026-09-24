export interface TestConnectionResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  provider?: string;
  accountStatus?: string;
}

export interface KeywordSearchInput {
  keyword: string;
  location?: string;
  language?: string;
}

export interface KeywordResult {
  keyword: string;
  searchVolume: number | null;
  competition: "LOW" | "MEDIUM" | "HIGH" | "UNSPECIFIED" | null;
  averageCpc: number | null;
  location: string | null;
  language: string | null;
  source: string;
  collectedAt: Date;
}

export interface TrendInput {
  keywords: string[];
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TrendResult {
  keyword: string;
  date: Date;
  value: number;
  location: string | null;
  source: string;
}

export interface ProductSearchInput {
  query?: string;
  domain?: string;
  asin?: string;
}

export interface ProductResult {
  id: string; // external ID
  title: string;
  url: string | null;
  price: number | null;
  rating: number | null;
  reviewCount: number | null;
  rank: number | null;
  source: string;
  collectedAt: Date;
}

export interface CompetitorInput {
  domain?: string;
  keyword?: string;
}

export interface CompetitorResult {
  domain: string;
  overlap: number;
  rank: number;
  source: string;
}

export type ProviderCapability = "SUPPORTED" | "NOT_SUPPORTED";

export interface TrendProvider {
  name: string;
  id: string;

  testConnection(): Promise<TestConnectionResult>;

  // Capability checks
  supportsKeywordResearch: ProviderCapability;
  supportsTrendData: ProviderCapability;
  supportsProductSearch: ProviderCapability;
  supportsCompetitorResearch: ProviderCapability;

  searchKeywords?(input: KeywordSearchInput): Promise<KeywordResult[]>;
  getTrendData?(input: TrendInput): Promise<TrendResult[]>;
  getProducts?(input: ProductSearchInput): Promise<ProductResult[]>;
  getCompetitors?(input: CompetitorInput): Promise<CompetitorResult[]>;
}

