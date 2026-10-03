from fastapi import FastAPI, HTTPException
from scrapling import StealthyFetcher
import re
import uuid

app = FastAPI(title="TrendScope Scraper API")

@app.get("/scrape/etsy")
def scrape_etsy(keyword: str):
    try:
        fetcher = StealthyFetcher()
        page = fetcher.get(f"https://www.etsy.com/search?q={keyword}")
        
        products = []
        # Cari elemen card Etsy menggunakan Adaptor Selector
        listings = page.css(".v2-listing-card")
        
        for item in listings[:30]:
            title_node = item.css("h3::text").get()
            title = title_node.strip() if title_node else "Etsy Listing"
            
            # Cari teks harga
            price_node = item.css(".currency-value::text").get()
            if not price_node:
                price_node = item.css("span.c-price__v2::text").get()
                
            price = 0.0
            if price_node:
                cleaned = re.sub(r'[^0-9.]', '', price_node)
                if cleaned:
                    price = float(cleaned)
                    
            # Cari rating/ulasan (sebagai estimasi sales)
            reviews_node = item.css(".v2-listing-card__shop-rating span.wt-text-caption::text").get()
            sales_count = 0
            if reviews_node:
                num = re.sub(r'[^0-9]', '', reviews_node)
                if num:
                    sales_count = int(num)
                    
            url_node = item.css("a::attr(href)").get()
            url = url_node if url_node else ""
            
            # Ekstrak ID unik
            external_id = str(uuid.uuid4())[:8]
            if "listing/" in url:
                parts = url.split("listing/")
                if len(parts) > 1:
                    external_id = parts[1].split("/")[0].split("?")[0]
            
            if title and price > 0:
                products.append({
                    "externalId": external_id,
                    "title": title,
                    "price": price,
                    "historicalSold": sales_count,
                    "url": url if url.startswith("http") else f"https://www.etsy.com{url}",
                })
                
        return {"success": True, "data": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
