"use server";

/**
 * Shopee API Integration via RapidAPI
 * 
 * Menggunakan "Shopee - Pair Product" atau scraper sejenis di RapidAPI.
 * Harga dikembalikan dalam Rupiah (angka bulat, misal 150000).
 * 
 * Variabel ENV yang dibutuhkan:
 *   RAPIDAPI_KEY - API key dari RapidAPI (sudah ada untuk Amazon)
 */

export interface ShopeeProduct {
  externalId: string;
  title: string;
  price: number; // dalam Rupiah (IDR), angka bulat
  historicalSold: number;
  url: string;
}

export async function searchShopee(keyword: string): Promise<ShopeeProduct[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error("[Shopee API] RAPIDAPI_KEY is not set in .env");
    return [];
  }

  try {
    // Menggunakan Shopee scraper dari RapidAPI
    // Endpoint ini mencari produk Shopee Indonesia
    const url = `https://shopee-scraper3.p.rapidapi.com/search?keyword=${encodeURIComponent(keyword)}&page=0&sort_by=relevancy&country=ID`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "shopee-scraper3.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[Shopee API] HTTP Error: ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Normalisasi response — struktur bisa berbeda per provider RapidAPI
    // Berikut mencoba beberapa kemungkinan struktur:
    let rawItems: any[] = [];

    if (Array.isArray(data)) {
      rawItems = data;
    } else if (data?.data?.items && Array.isArray(data.data.items)) {
      rawItems = data.data.items;
    } else if (data?.items && Array.isArray(data.items)) {
      rawItems = data.items;
    } else if (data?.data && Array.isArray(data.data)) {
      rawItems = data.data;
    }

    if (rawItems.length === 0) {
      console.warn("[Shopee API] No items found for keyword:", keyword);
      return [];
    }

    const products: ShopeeProduct[] = rawItems.slice(0, 50).map((item: any) => {
      // Shopee API biasanya mengembalikan harga dalam unit terkecil (x100000)
      // Contoh: 15000000000 = Rp 150.000 (bagi 100000)
      // Tapi tergantung API, bisa juga langsung Rupiah.
      let price = 0;
      if (item.price !== undefined) {
        price = Number(item.price);
        // Jika harga terlalu besar (> 1 miliar), kemungkinan dalam format mikro
        if (price > 1_000_000_000) {
          price = Math.round(price / 100000);
        }
      } else if (item.price_min !== undefined) {
        price = Number(item.price_min);
        if (price > 1_000_000_000) {
          price = Math.round(price / 100000);
        }
      }

      const historicalSold = 
        item.historical_sold ?? 
        item.sold ?? 
        item.item_sold ?? 
        item.sales ?? 
        0;

      const shopId = item.shopid ?? item.shop_id ?? "";
      const itemId = item.itemid ?? item.item_id ?? item.id ?? "";

      return {
        externalId: String(itemId),
        title: (item.name ?? item.title ?? "Produk Shopee").substring(0, 200),
        price: Math.round(price),
        historicalSold: Number(historicalSold) || 0,
        url: itemId && shopId
          ? `https://shopee.co.id/product/${shopId}/${itemId}`
          : item.url ?? item.product_url ?? "",
      };
    });

    return products;
  } catch (error: any) {
    console.error("[Shopee API] Error:", error.message);
    return [];
  }
}
