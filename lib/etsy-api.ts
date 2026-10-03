"use server";

/**
 * Etsy API Integration via RapidAPI (etsy-scraper.p.rapidapi.com / etsy-api.p.rapidapi.com)
 *
 * Mengambil data produk, harga ($ USD), rating/penjualan dari Etsy.
 * ENV yang dibutuhkan: RAPIDAPI_KEY
 */

export interface EtsyProduct {
  externalId: string;
  title: string;
  price: number; // dalam USD ($)
  historicalSold: number;
  url: string;
}

export async function searchEtsy(keyword: string): Promise<EtsyProduct[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    console.error("[Etsy API] RAPIDAPI_KEY belum disetel di .env");
    return [];
  }

  const cleanKeyword = encodeURIComponent(keyword.trim());
  const endpoints = [
    {
      host: "etsy-scraper.p.rapidapi.com",
      url: `https://etsy-scraper.p.rapidapi.com/search?keyword=${cleanKeyword}`,
    },
    {
      host: "etsy-api.p.rapidapi.com",
      url: `https://etsy-api.p.rapidapi.com/search?query=${cleanKeyword}`,
    },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[Etsy API] Menghubungi ${endpoint.host}...`);

      const response = await fetch(endpoint.url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": endpoint.host,
          "x-rapidapi-key": apiKey,
        },
        cache: "no-store",
      });

      if (response.status === 403) {
        console.warn(
          `[Etsy API] ⚠️ Belum subscribe ke ${endpoint.host} di RapidAPI. Silakan aktifkan free tier di rapidapi.com`
        );
        continue;
      }

      if (!response.ok) {
        console.error(`[Etsy API] HTTP Error ${response.status} dari ${endpoint.host}`);
        continue;
      }

      const data = await response.json();
      let rawList: any[] = [];

      if (Array.isArray(data)) {
        rawList = data;
      } else if (Array.isArray(data?.results)) {
        rawList = data.results;
      } else if (Array.isArray(data?.data)) {
        rawList = data.data;
      } else if (Array.isArray(data?.products)) {
        rawList = data.products;
      } else if (Array.isArray(data?.items)) {
        rawList = data.items;
      }

      if (rawList.length === 0) {
        continue;
      }

      console.log(`[Etsy API] ✅ Berhasil mengambil ${rawList.length} produk dari ${endpoint.host}`);

      const products: EtsyProduct[] = rawList.slice(0, 50).map((item: any) => {
        let price = 0;
        if (typeof item.price === "number") {
          price = item.price;
        } else if (typeof item.price === "string") {
          const parsed = parseFloat(item.price.replace(/[^0-9.]/g, ""));
          price = isNaN(parsed) ? 0 : parsed;
        } else if (item.price?.amount) {
          price = Number(item.price.amount) / (item.price.divisor || 100);
        }

        const id = item.listing_id || item.id || item.productId || String(Math.random());
        const salesCount =
          item.sales ||
          item.reviews_count ||
          item.num_favorers ||
          item.views ||
          item.favorites ||
          0;

        return {
          externalId: String(id),
          title: (item.title || item.name || "Etsy Listing").substring(0, 200),
          price: Number(price.toFixed(2)),
          historicalSold: Number(salesCount) || 0,
          url: item.url || (id ? `https://www.etsy.com/listing/${id}` : "https://www.etsy.com"),
        };
      });

      return products;
    } catch (err: any) {
      console.error(`[Etsy API] Error pada ${endpoint.host}:`, err.message);
      continue;
    }
  }

  console.warn("[Etsy API] Tidak ada endpoint yang berhasil merespons.");
  return [];
}
