import { TrendProvider } from "./trend-provider";
import { GoogleAdsProvider } from "./google-ads-provider";
import { DataForSeoTrendsProvider } from "./dataforseo-trends-provider";
import { ShopifyProvider } from "./shopify-provider";
import { EnvatoProvider } from "./envato-provider";

export type ProviderId = 
  | "GOOGLE_ADS" 
  | "DATAFORSEO_TRENDS" 
  | "DATAFORSEO_LABS_GOOGLE" 
  | "DATAFORSEO_LABS_AMAZON" 
  | "ENVATO" 
  | "SHOPIFY";

/**
 * Factory to instantiate the correct provider class based on the ID and credentials.
 */
export function getProviderInstance(
  providerId: string, 
  encryptedCredentials: string
): TrendProvider {
  switch (providerId as ProviderId) {
    case "GOOGLE_ADS":
      return new GoogleAdsProvider(encryptedCredentials);
    case "DATAFORSEO_TRENDS":
      return new DataForSeoTrendsProvider(encryptedCredentials);
    case "SHOPIFY":
      return new ShopifyProvider(encryptedCredentials);
    case "ENVATO":
      return new EnvatoProvider(encryptedCredentials);
    // Add others as they are implemented
    default:
      throw new Error(`Unsupported provider type: ${providerId}`);
  }
}

