import { 
  TrendProvider, 
  TestConnectionResult, 
  TrendInput, 
  TrendResult, 
  ProviderCapability 
} from "./trend-provider";
import { decryptSecret } from "../encryption";

export interface DataForSeoCredentials {
  login: string;
  password: string;
}

export class DataForSeoTrendsProvider implements TrendProvider {
  name = "DataForSEO Trends";
  id = "DATAFORSEO_TRENDS";

  supportsKeywordResearch: ProviderCapability = "NOT_SUPPORTED";
  supportsTrendData: ProviderCapability = "SUPPORTED";
  supportsProductSearch: ProviderCapability = "NOT_SUPPORTED";
  supportsCompetitorResearch: ProviderCapability = "NOT_SUPPORTED";

  private credentials: DataForSeoCredentials;
  private baseUrl = "https://api.dataforseo.com/v3";

  constructor(encryptedCredentialsJson: string) {
    try {
      const decrypted = decryptSecret(encryptedCredentialsJson);
      this.credentials = JSON.parse(decrypted);
    } catch (e) {
      throw new Error("Failed to decrypt DataForSEO credentials");
    }
  }

  private get authHeader(): string {
    return "Basic " + Buffer.from(`${this.credentials.login}:${this.credentials.password}`).toString("base64");
  }

  async testConnection(): Promise<TestConnectionResult> {
    const start = Date.now();
    try {
      // Endpoint to check account balance/status is a good lightweight test
      const response = await fetch(`${this.baseUrl}/dataforseo_labs/google/locations`, {
        method: "GET",
        headers: { "Authorization": this.authHeader }
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

      return {
        success: true,
        message: "Connection successful",
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

  async getTrendData(input: TrendInput): Promise<TrendResult[]> {
    // DataForSEO Google Trends endpoint supports up to 5 keywords
    const keywords = input.keywords.slice(0, 5);
    if (keywords.length === 0) return [];

    const payload = [{
      keywords: keywords,
      location_name: input.location || "United States",
      type: "web",
      // date_from and date_to are supported, e.g., "2023-01-01"
      ...(input.dateFrom && { date_from: input.dateFrom }),
      ...(input.dateTo && { date_to: input.dateTo })
    }];

    const response = await fetch(`${this.baseUrl}/dataforseo_labs/google/trends/explore/live`, {
      method: "POST",
      headers: {
        "Authorization": this.authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("PROVIDER_RATE_LIMITED");
      }
      throw new Error(`DataForSEO API error: ${response.status}`);
    }

    const data = await response.json();
    const results: TrendResult[] = [];

    // Map DataForSEO complex response structure to normalized TrendResult
    if (data.tasks && data.tasks.length > 0 && data.tasks[0].result) {
      const taskResult = data.tasks[0].result;
      
      for (const res of taskResult) {
        if (!res.items) continue;
        
        for (const item of res.items) {
          // values usually come back as an array of { date, values: [val1, val2] } matching the keywords order
          const dateStr = item.date;
          const vals = item.values;
          
          if (!dateStr || !vals) continue;

          keywords.forEach((kw, index) => {
            const val = vals[index];
            if (val !== null && val !== undefined) {
              results.push({
                keyword: kw,
                date: new Date(dateStr),
                value: val,
                location: input.location || null,
                source: this.id
              });
            }
          });
        }
      }
    }

    return results;
  }
}

