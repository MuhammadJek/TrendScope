from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
import os
import json
import time
import re

try:
    from patchright.sync_api import sync_playwright
except ImportError:
    from playwright.sync_api import sync_playwright

app = FastAPI(title="TrendScope Scraper API")

# Izinkan Next.js memanggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PROFILE_DIR = os.path.join(os.getcwd(), "shopee_profile")

@app.get("/login-shopee")
def open_login_window():
    """Buka browser agar user bisa login manual ke Shopee sekali untuk menyimpan session."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch_persistent_context(
                user_data_dir=PROFILE_DIR,
                headless=False,
                viewport={"width": 1280, "height": 720}
            )
            page = browser.pages[0] if browser.pages else browser.new_page()
            page.goto("https://shopee.co.id/buyer/login", timeout=60000)
            print("Jendela browser login Shopee terbuka. Tunggu hingga 90 detik atau tutup setelah selesai...")
            page.wait_for_timeout(90000)
            browser.close()
        return {"success": True, "message": "Sesi login telah tersimpan di shopee_profile."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scrape/shopee")
def scrape_shopee(keyword: str, headless: bool = False):
    try:
        products = []
        captured_data = {}
        error_code = None

        url = f"https://shopee.co.id/search?keyword={urllib.parse.quote(keyword)}"

        with sync_playwright() as p:
            browser = p.chromium.launch_persistent_context(
                user_data_dir=PROFILE_DIR,
                headless=headless,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox"
                ],
                viewport={"width": 1280, "height": 720}
            )
            page = browser.pages[0] if browser.pages else browser.new_page()

            # Listener untuk menangkap response API Shopee
            def on_response(response):
                nonlocal captured_data, error_code
                try:
                    if response.status == 200:
                        req_url = response.url
                        res_json = response.json()
                        
                        if "api/v4/search" in req_url or "api/v4/item" in req_url or "search_items" in req_url:
                            with open("scraper_debug.log", "a", encoding="utf-8") as f:
                                f.write(f"\n--- INTERCEPTED: {req_url} ---\n")
                                f.write(f"Keys: {list(res_json.keys())}\n")
                                if "data" in res_json and isinstance(res_json["data"], dict):
                                    f.write(f"Data Keys: {list(res_json['data'].keys())}\n")
                                    if "sections" in res_json["data"]:
                                        f.write(f"Has sections! len: {len(res_json['data']['sections'])}\n")
                                    if "items" in res_json["data"]:
                                        f.write(f"Has items in data! len: {len(res_json['data']['items'])}\n")
                                if "items" in res_json:
                                    f.write(f"Has items at root! len: {len(res_json['items'])}\n")
                                    if len(res_json['items']) > 0:
                                        f.write(f"First item keys: {list(res_json['items'][0].keys())}\n")

                        # Cek error 90309999 (Anti-bot)
                        if res_json.get("error") == 90309999:
                            error_code = 90309999

                        # Cari data produk di dalam items
                        items_list = None
                        if "items" in res_json and isinstance(res_json["items"], list):
                            items_list = res_json["items"]
                        elif "data" in res_json and "items" in res_json["data"] and isinstance(res_json["data"]["items"], list):
                            items_list = res_json["data"]["items"]
                        elif "data" in res_json and "sections" in res_json["data"] and isinstance(res_json["data"]["sections"], list):
                            for section in res_json["data"]["sections"]:
                                if "data" in section and "item" in section["data"] and isinstance(section["data"]["item"], list):
                                    items_list = section["data"]["item"]
                                    print(f"FOUND items in sections! len: {len(items_list)}")
                                    break

                        if items_list and len(items_list) > 0:
                            # Pastikan ini adalah list of products
                            if "item_basic" in items_list[0]:
                                captured_data = {"items": items_list}
                            elif "name" in items_list[0] or "itemid" in items_list[0]:
                                captured_data = {"items": [{"item_basic": i} for i in items_list]}
                except Exception:
                    pass

            page.on("response", on_response)

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=45000)
            except Exception as e:
                print(f"Goto notice: {e}")

            # Jeda untuk request network
            page.wait_for_timeout(3000)

            # Jika ada modal bahasa, klik otomatis
            lang_btn = page.locator('text="Bahasa Indonesia"')
            if lang_btn.count() > 0:
                try:
                    lang_btn.first.click()
                    page.wait_for_timeout(3000)
                except Exception:
                    pass

            # Scroll untuk trigger lazy loading jika API belum tertangkap
            if not captured_data:
                page.evaluate("window.scrollBy(0, 800)")
                page.wait_for_timeout(3000)

            browser.close()
            
        with open("scraper_debug.log", "a", encoding="utf-8") as f:
            f.write(f"\n--- DONE WAITING ---\n")
            f.write(f"captured_data keys: {list(captured_data.keys())}\n")
            f.write(f"items len: {len(captured_data.get('items', []))}\n")

        # Proses data JSON resmi yang ditangkap dari API Shopee
        items = captured_data.get("items", [])
        for item in items[:25]:
            basic = item.get("item_basic") or {}
            
            # Jika tidak ada name, coba ambil dari item.get("display_name")
            name = basic.get("name") or item.get("display_name") or item.get("name") or "Produk Shopee"
            
            # Harga di API Shopee dalam satuan x100000
            raw_price = basic.get("price") or basic.get("price_min") or item.get("price") or item.get("price_min")
            if not raw_price:
                # Coba cari dari item_card_price
                card_price = item.get("item_card_price", {})
                if isinstance(card_price, dict):
                    raw_price = card_price.get("price") or card_price.get("price_min") or 0
            
            raw_price = raw_price or 0
                    
            if raw_price > 1000000 and raw_price % 100000 == 0:
                price_val = raw_price // 100000
            elif raw_price > 100000:
                price_val = raw_price // 100000
            else:
                price_val = raw_price
            
            price_formatted = f"Rp {price_val:,}".replace(",", ".")

            sold = basic.get("historical_sold") or item.get("historical_sold") or 0
            if sold >= 1000:
                sold_formatted = f"{sold // 1000}RB+ Terjual"
            elif sold > 0:
                sold_formatted = f"{sold} Terjual"
            else:
                sold_formatted = "0 Terjual"

            rating_info = basic.get("item_rating") or item.get("item_rating") or {}
            rating = round(rating_info.get("rating_star", 5.0), 1)
            
            img_hash = basic.get("image") or item.get("algo_image") or item.get("image") or ""
            image_url = f"https://down-id.img.susercontent.com/file/{img_hash}" if img_hash else "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80"
            shop_id = str(basic.get("shopid") or item.get("shopid") or 0)
            item_id = str(basic.get("itemid") or item.get("itemid") or 0)
            name_slug = re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-')
            product_url = f"https://shopee.co.id/{name_slug}-i.{shop_id}.{item_id}"

            products.append({
                "item_id": item_id,
                "shop_id": shop_id,
                "name": name,
                "price": price_formatted,
                "sold": sold_formatted,
                "rating": rating,
                "image_url": image_url,
                "product_url": product_url
            })

        print(f"Total produk berhasil di-intercept: {len(products)} (error_code: {error_code})")

        return {
            "success": True,
            "data": products,
            "requires_login": error_code == 90309999
        }

    except Exception as e:
        print(f"Scraper Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
