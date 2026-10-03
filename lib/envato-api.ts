"use server";

/**
 * Envato Market API Integration
 * 
 * Menggunakan Envato API resmi untuk mencari item di ThemeForest, CodeCanyon, dll.
 * Harga dikembalikan dalam Dollar (USD), desimal, misal 59.00.
 * 
 * Variabel ENV yang dibutuhkan:
 *   ENVATO_TOKEN - Personal Token dari https://build.envato.com/my-apps/
 */

export interface EnvatoProduct {
  externalId: string;
  title: string;
  price: number; // dalam USD, desimal
  historicalSold: number; // number_of_sales
  url: string;
}

export async function searchEnvato(keyword: string): Promise<EnvatoProduct[]> {
  const token = process.env.ENVATO_TOKEN;
  if (!token) {
    console.error("[Envato API] ENVATO_TOKEN is not set in .env");
    return [];
  }

  try {
    // Envato Discovery API - search across ThemeForest
    // Bisa diganti site ke codecanyon.net, videohive.net, dll
    const url = `https://api.envato.com/v1/discovery/search/search/item?site=themeforest.net&term=${encodeURIComponent(keyword)}&page_size=50&sort_by=relevance`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[Envato API] HTTP Error: ${response.status}`);
      // Jika 401/403, token salah atau expired
      if (response.status === 401 || response.status === 403) {
        console.error("[Envato API] Token invalid atau expired. Buat ulang di https://build.envato.com/my-apps/");
      }
      return [];
    }

    const data = await response.json();

    // Envato API response: { "matches": [ ... ] }
    let rawItems: any[] = [];

    if (data?.matches && Array.isArray(data.matches)) {
      rawItems = data.matches;
    } else if (Array.isArray(data)) {
      rawItems = data;
    }

    if (rawItems.length === 0) {
      console.warn("[Envato API] No items found for keyword:", keyword);
      return [];
    }

    const products: EnvatoProduct[] = rawItems.slice(0, 50).map((item: any) => {
      // Harga dari Envato bisa dalam "price_cents" (integer) atau "price" (string/number)
      let price = 0;
      if (item.price_cents !== undefined) {
        price = Number(item.price_cents) / 100; // Konversi cents ke dollar
      } else if (item.price !== undefined) {
        price = parseFloat(String(item.price)) || 0;
      }

      const historicalSold = item.number_of_sales ?? item.sales ?? 0;

      return {
        externalId: String(item.id ?? item.item_id ?? ""),
        title: (item.name ?? item.title ?? "Envato Item").substring(0, 200),
        price: Math.round(price * 100) / 100, // 2 decimal places
        historicalSold: Number(historicalSold) || 0,
        url: item.url ?? item.site_url ?? `https://themeforest.net/item/-/${item.id}`,
      };
    });

    return products;
  } catch (error: any) {
    console.error("[Envato API] Error:", error.message);
    return [];
  }
}
