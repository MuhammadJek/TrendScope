import {
  IMarketplaceProvider,
  MarketplaceSearchParams,
  MarketplaceSearchResult,
  MarketplaceProviderHealth,
  NormalizedProductListing,
} from "./marketplace-provider";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: CachedToken | null = null;

export class EbayBrowseProvider implements IMarketplaceProvider {
  readonly id = "EBAY" as const;
  readonly name = "eBay Browse API";

  private clientId: string | undefined;
  private clientSecret: string | undefined;
  private isSandbox: boolean;

  constructor() {
    this.clientId = process.env.EBAY_CLIENT_ID;
    this.clientSecret = process.env.EBAY_CLIENT_SECRET;
    this.isSandbox = process.env.EBAY_ENV === "SANDBOX";
  }

  private getBaseUrl(): string {
    return this.isSandbox
      ? "https://api.sandbox.ebay.com"
      : "https://api.ebay.com";
  }

  /**
   * Fetches or reuses cached OAuth 2.0 application access token (Client Credentials Grant)
   */
  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("EBAY_CLIENT_ID and EBAY_CLIENT_SECRET are required in environment variables.");
    }

    if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) {
      return tokenCache.accessToken;
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const tokenUrl = `${this.getBaseUrl()}/identity/v1/oauth2/token`;

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`eBay OAuth token request failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const expiresIn = Number(data.expires_in) || 7200;

    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    return tokenCache.accessToken;
  }

  async checkHealth(): Promise<MarketplaceProviderHealth> {
    if (!this.clientId || !this.clientSecret) {
      return {
        status: "UNCONFIGURED",
        message: "eBay Browse API credentials (EBAY_CLIENT_ID & EBAY_CLIENT_SECRET) are not set.",
      };
    }

    const startTime = Date.now();
    try {
      await this.getAccessToken();
      const latencyMs = Date.now() - startTime;
      return {
        status: "CONNECTED",
        message: "Successfully connected to eBay OAuth & Browse API.",
        latencyMs,
      };
    } catch (err: any) {
      return {
        status: "ERROR",
        message: err.message || "Failed to authenticate with eBay.",
        latencyMs: Date.now() - startTime,
      };
    }
  }

  async search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult> {
    const limit = Math.min(Math.max(params.limit || 20, 1), 50);
    const offset = Math.max(params.offset || 0, 0);

    if (!this.clientId || !this.clientSecret) {
      return {
        source: "EBAY",
        query: params.query,
        totalResults: 0,
        limit,
        offset,
        items: [],
        dataStatus: "UNAVAILABLE",
        statusMessage: "eBay Browse API credentials not configured. Please supply EBAY_CLIENT_ID in .env.",
      };
    }

    try {
      const token = await this.getAccessToken();
      const marketplaceId = params.country === "UK" ? "EBAY_GB" : "EBAY_US";

      const queryParams = new URLSearchParams({
        q: params.query,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (params.sort) {
        queryParams.set("sort", params.sort);
      }

      if (params.minPrice || params.maxPrice) {
        const priceFilter: string[] = [];
        if (params.minPrice) priceFilter.push(`price:[${params.minPrice}..`);
        if (params.maxPrice) priceFilter.push(`..${params.maxPrice}]`);
        queryParams.set("filter", priceFilter.join(""));
      }

      const searchUrl = `${this.getBaseUrl()}/buy/browse/v1/item_summary/search?${queryParams.toString()}`;

      const res = await fetch(searchUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 429) {
          return {
            source: "EBAY",
            query: params.query,
            totalResults: 0,
            limit,
            offset,
            items: [],
            dataStatus: "UNAVAILABLE",
            statusMessage: "eBay API rate limit / quota exceeded.",
          };
        }
        throw new Error(`eBay search failed with status ${res.status}`);
      }

      const data = await res.json();
      const rawItems = Array.isArray(data.itemSummaries) ? data.itemSummaries : [];

      const normalized: NormalizedProductListing[] = rawItems.map((item: any, idx: number) => {
        const priceVal = parseFloat(item.price?.value || "0");
        const currency = item.price?.currency || "USD";
        const seller = item.seller?.username || null;
        const thumbnail = item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || null;
        const rating = item.seller?.feedbackPercentage ? parseFloat(item.seller.feedbackPercentage) / 20 : null;
        const reviewCount = item.seller?.feedbackScore ? parseInt(item.seller.feedbackScore, 10) : null;

        // Opportunity and momentum heuristic for listing
        const momentum: "STRONG_UP" | "MODERATE_UP" | "STABLE" | "DECLINING" =
          idx < 3 ? "STRONG_UP" : idx < 10 ? "MODERATE_UP" : "STABLE";

        const competition: "LOW" | "MEDIUM" | "HIGH" =
          rawItems.length > 30 ? "HIGH" : rawItems.length > 10 ? "MEDIUM" : "LOW";

        const score = Math.max(10, Math.min(95, Math.round(85 - idx * 2.5 + (rating ? rating * 2 : 0))));

        return {
          id: `ebay:${item.itemId}`,
          externalId: item.itemId,
          source: "EBAY" as const,
          title: item.title || "eBay Listing",
          thumbnailUrl: thumbnail,
          originalUrl: item.itemWebUrl || null,
          price: priceVal,
          currency,
          category: item.categories?.[0]?.categoryName || params.category || "General",
          availability: "IN_STOCK",
          rating: rating ? Math.min(5, Math.max(1, parseFloat(rating.toFixed(1)))) : null,
          reviewCount,
          sellerName: seller,
          historicalPrices: [
            { price: priceVal, recordedAt: new Date().toISOString() },
          ],
          trendMomentum: momentum,
          competitionIndicator: competition,
          opportunityScore: score,
          lastObservedAt: new Date().toISOString(),
          dataStatus: "OBSERVED" as const,
        };
      });

      return {
        source: "EBAY",
        query: params.query,
        totalResults: data.total || normalized.length,
        offset,
        limit,
        items: normalized,
        dataStatus: "OBSERVED",
      };
    } catch (err: any) {
      console.error("eBay search error:", err);
      return {
        source: "EBAY",
        query: params.query,
        totalResults: 0,
        offset,
        limit,
        items: [],
        dataStatus: "UNAVAILABLE",
        statusMessage: err.message || "Failed to communicate with eBay Browse API.",
      };
    }
  }

  async getProduct(externalId: string): Promise<NormalizedProductListing | null> {
    if (!this.clientId || !this.clientSecret) return null;

    try {
      const token = await this.getAccessToken();
      const url = `${this.getBaseUrl()}/buy/browse/v1/item/${encodeURIComponent(externalId)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
        },
      });

      if (!res.ok) return null;
      const data = await res.json();
      const priceVal = parseFloat(data.price?.value || "0");

      return {
        id: `ebay:${data.itemId}`,
        externalId: data.itemId,
        source: "EBAY",
        title: data.title,
        thumbnailUrl: data.image?.imageUrl || null,
        originalUrl: data.itemWebUrl || null,
        price: priceVal,
        currency: data.price?.currency || "USD",
        category: data.primaryProductCategory?.categoryName || "General",
        availability: "IN_STOCK",
        rating: null,
        reviewCount: null,
        sellerName: data.seller?.username || null,
        historicalPrices: [{ price: priceVal, recordedAt: new Date().toISOString() }],
        trendMomentum: "MODERATE_UP",
        competitionIndicator: "MEDIUM",
        opportunityScore: 75,
        lastObservedAt: new Date().toISOString(),
        dataStatus: "OBSERVED",
      };
    } catch {
      return null;
    }
  }
}
