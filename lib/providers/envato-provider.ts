import { 
  TrendProvider, 
  TestConnectionResult, 
  ProductSearchInput, 
  ProductResult, 
  ProviderCapability 
} from "./trend-provider";
import { decryptSecret } from "../encryption";

export interface EnvatoCredentials {
  personalToken: string;
}

export class EnvatoProvider implements TrendProvider {
  name = "Envato";
  id = "ENVATO";

  supportsKeywordResearch: ProviderCapability = "NOT_SUPPORTED";
  supportsTrendData: ProviderCapability = "NOT_SUPPORTED";
  supportsProductSearch: ProviderCapability = "SUPPORTED";
  supportsCompetitorResearch: ProviderCapability = "NOT_SUPPORTED";

  private credentials: EnvatoCredentials;

  constructor(encryptedCredentialsJson: string) {
    try {
      const decrypted = decryptSecret(encryptedCredentialsJson);
      this.credentials = JSON.parse(decrypted);
    } catch (e) {
      throw new Error("Failed to decrypt Envato credentials");
    }
  }

  async testConnection(): Promise<TestConnectionResult> {
    const start = Date.now();
    try {
      // Endpoint to check account identity
      const response = await fetch("https://api.envato.com/v1/market/private/user/username.json", {
        headers: {
          "Authorization": `Bearer ${this.credentials.personalToken}`,
          "User-Agent": "TrendScopeApp/1.0"
        }
      });

      const latencyMs = Date.now() - start;

      if (!response.ok) {
        return {
          success: false,
          message: `HTTP ${response.status}: Failed to connect`,
          latencyMs,
          provider: this.name,
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: `Connected as ${data.username}`,
        latencyMs,
        provider: this.name,
        accountStatus: "Active",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Unknown error occurred",
        latencyMs: Date.now() - start,
        provider: this.name,
      };
    }
  }

  async getProducts(input: ProductSearchInput): Promise<ProductResult[]> {
    if (!input.query) return [];

    const url = new URL("https://api.envato.com/v1/discovery/search/search/item");
    url.searchParams.append("term", input.query);
    url.searchParams.append("page_size", "20");
    url.searchParams.append("sort_by", "relevance");

    const response = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${this.credentials.personalToken}`,
        "User-Agent": "TrendScopeApp/1.0"
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("PROVIDER_RATE_LIMITED");
      }
      throw new Error(`Envato API error: ${response.status}`);
    }

    const data = await response.json();
    const results: ProductResult[] = [];

    if (data.matches) {
      for (const item of data.matches) {
        results.push({
          id: item.id.toString(),
          title: item.name,
          url: item.url || null,
          price: item.price_cents ? item.price_cents / 100 : null,
          rating: item.rating?.rating || null,
          reviewCount: item.rating?.count || null,
          rank: null,
          source: this.id,
          collectedAt: new Date()
        });
      }
    }

    return results;
  }
}

