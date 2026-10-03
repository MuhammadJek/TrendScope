"use server";

/**
 * Shopee API Integration via RapidAPI
 *
 * Menggunakan "Shopee API" di RapidAPI (shopee-api.p.rapidapi.com).
 * ⚠️  PENTING: Anda harus subscribe ke API ini di RapidAPI terlebih dahulu:
 *     https://rapidapi.com/search/shopee
 *     Cari "Shopee API" → klik Subscribe (ada free tier).
 *
 * Harga dikembalikan dalam Rupiah (IDR), angka bulat.
 *
 * Variabel ENV yang dibutuhkan:
 *   RAPIDAPI_KEY — API key dari RapidAPI (sudah ada untuk Amazon)
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

  // Coba beberapa endpoint RapidAPI Shopee yang diketahui masih aktif
  const endpoints = [
    {
      host: "shopee-api.p.rapidapi.com",
      url: `https://shopee-api.p.rapidapi.com/search?keyword=${encodeURIComponent(keyword)}&country=id`,
    },
    {
      host: "shopee2.p.rapidapi.com",
      url: `https://shopee2.p.rapidapi.com/search?keyword=${encodeURIComponent(keyword)}&country=id`,
    },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[Shopee API] Trying ${endpoint.host}...`);

      const response = await fetch(endpoint.url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": endpoint.host,
          "x-rapidapi-key": apiKey,
        },
        cache: "no-store",
      });

      // 403 = Not subscribed, 404 = API doesn't exist → skip to next
      if (response.status === 403) {
        console.warn(
          `[Shopee API] ❌ Belum subscribe ke ${endpoint.host}. Silakan subscribe di https://rapidapi.com`
        );
        continue;
      }
      if (response.status === 404) {
        console.warn(`[Shopee API] ${endpoint.host} tidak ditemukan, skip...`);
        continue;
      }
      if (!response.ok) {
        console.error(
          `[Shopee API] HTTP Error ${response.status} dari ${endpoint.host}`
        );
        continue;
      }

      const data = await response.json();

      // Normalisasi response — struktur bisa berbeda per provider RapidAPI
      let rawItems: any[] = [];
      if (Array.isArray(data)) {
        rawItems = data;
      } else if (data?.data?.items && Array.isArray(data.data.items)) {
        rawItems = data.data.items;
      } else if (data?.items && Array.isArray(data.items)) {
        rawItems = data.items;
      } else if (data?.data && Array.isArray(data.data)) {
        rawItems = data.data;
      } else if (data?.products && Array.isArray(data.products)) {
        rawItems = data.products;
      } else if (data?.result?.items && Array.isArray(data.result.items)) {
        rawItems = data.result.items;
      }

      if (rawItems.length === 0) {
        console.warn("[Shopee API] Tidak ada produk ditemukan untuk:", keyword);
        continue;
      }

      console.log(`[Shopee API] ✅ ${rawItems.length} produk ditemukan dari ${endpoint.host}`);

      const products: ShopeeProduct[] = rawItems
        .slice(0, 50)
        .map((item: any) => {
          // Parse harga — Shopee API bisa return dalam berbagai format
          let price = 0;
          if (item.price !== undefined) {
            price = Number(item.price);
            // Jika harga terlalu besar (format mikro Shopee: x100000)
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
            item.orders ??
            0;

          const shopId = item.shopid ?? item.shop_id ?? "";
          const itemId = item.itemid ?? item.item_id ?? item.id ?? "";

          return {
            externalId: String(itemId),
            title: (
              item.name ??
              item.title ??
              item.product_name ??
              "Produk Shopee"
            ).substring(0, 200),
            price: Math.round(price),
            historicalSold: Number(historicalSold) || 0,
            url:
              itemId && shopId
                ? `https://shopee.co.id/product/${shopId}/${itemId}`
                : item.url ?? item.product_url ?? "",
          };
        });

      return products;
    } catch (error: any) {
      console.error(`[Shopee API] Error dari ${endpoint.host}:`, error.message);
      continue;
    }
  }

  // Semua endpoint gagal
  console.error(
    "[Shopee API] ⚠️ Semua endpoint gagal. Pastikan Anda sudah subscribe ke Shopee API di RapidAPI."
  );
  return [];
}
