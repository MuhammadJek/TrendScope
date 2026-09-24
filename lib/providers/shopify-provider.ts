import { 
  TrendProvider, 
  TestConnectionResult, 
  ProductSearchInput, 
  ProductResult, 
  ProviderCapability 
} from "./trend-provider";
import { decryptSecret } from "../encryption";

export interface ShopifyCredentials {
  shopDomain: string;
  accessToken: string; // This is the encrypted token stored in DB for this specific merchant
  apiVersion: string;
}

export class ShopifyProvider implements TrendProvider {
  name = "Shopify";
  id = "SHOPIFY";

  supportsKeywordResearch: ProviderCapability = "NOT_SUPPORTED";
  supportsTrendData: ProviderCapability = "NOT_SUPPORTED";
  supportsProductSearch: ProviderCapability = "SUPPORTED";
  supportsCompetitorResearch: ProviderCapability = "NOT_SUPPORTED";

  private credentials: ShopifyCredentials;

  constructor(encryptedCredentialsJson: string) {
    try {
      const decrypted = decryptSecret(encryptedCredentialsJson);
      this.credentials = JSON.parse(decrypted);
    } catch (e) {
      throw new Error("Failed to decrypt Shopify credentials");
    }
  }

  private get graphqlUrl(): string {
    const version = this.credentials.apiVersion || "2024-01";
    return `https://${this.credentials.shopDomain}/admin/api/${version}/graphql.json`;
  }

  private async fetchGraphQL(query: string, variables = {}) {
    const response = await fetch(this.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.credentials.accessToken,
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("PROVIDER_RATE_LIMITED");
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(`Shopify GraphQL Error: ${data.errors[0].message}`);
    }

    return data.data;
  }

  async testConnection(): Promise<TestConnectionResult> {
    const start = Date.now();
    try {
      const query = `
        query {
          shop {
            name
            plan {
              displayName
            }
          }
        }
      `;
      
      const data = await this.fetchGraphQL(query);
      const latencyMs = Date.now() - start;

      return {
        success: true,
        message: `Connected to ${data.shop.name}`,
        latencyMs,
        provider: this.name,
        accountStatus: data.shop.plan.displayName,
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
    const query = `
      query getProducts($query: String!) {
        products(first: 20, query: $query) {
          edges {
            node {
              id
              title
              onlineStoreUrl
              priceRangeV2 {
                minVariantPrice {
                  amount
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: input.query ? `title:*${input.query}*` : ""
    };

    const data = await this.fetchGraphQL(query, variables);
    const results: ProductResult[] = [];

    if (data.products && data.products.edges) {
      for (const edge of data.products.edges) {
        const node = edge.node;
        results.push({
          id: node.id,
          title: node.title,
          url: node.onlineStoreUrl || null,
          price: node.priceRangeV2?.minVariantPrice?.amount ? parseFloat(node.priceRangeV2.minVariantPrice.amount) : null,
          rating: null,
          reviewCount: null,
          rank: null,
          source: this.id,
          collectedAt: new Date()
        });
      }
    }

    return results;
  }
}

