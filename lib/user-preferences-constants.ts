export interface UserDashboardPreferences {
  country: string; // e.g. "US"
  categories: string[]; // e.g. ["Fashion & Apparel", "Beauty & Personal Care"]
  timeRange: "24h" | "7d" | "30d" | "90d";
  searchQuery?: string;
}

export const AVAILABLE_CATEGORIES = [
  "Fashion & Apparel",
  "Beauty & Personal Care",
  "Electronics & Gadgets",
  "Home & Living",
  "Health & Fitness",
  "Toys & Hobbies",
  "Digital Products",
  "Sports & Outdoors",
] as const;

export const AVAILABLE_COUNTRIES = [
  { code: "US", name: "United States (US)" },
  { code: "UK", name: "United Kingdom (UK)" },
  { code: "ID", name: "Indonesia (ID)" },
  { code: "CA", name: "Canada (CA)" },
] as const;

export const DEFAULT_PREFERENCES: UserDashboardPreferences = {
  country: "US",
  categories: ["Fashion & Apparel", "Beauty & Personal Care"],
  timeRange: "30d",
  searchQuery: "",
};
