import json
try:
    from patchright.sync_api import sync_playwright
except ImportError:
    from playwright.sync_api import sync_playwright
import urllib.parse
import os

PROFILE_DIR = os.path.join(os.getcwd(), "shopee_profile")

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=PROFILE_DIR,
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox"
            ],
            viewport={"width": 1280, "height": 720}
        )
        page = browser.pages[0] if browser.pages else browser.new_page()
        
        captured_data = []

        def on_response(response):
            try:
                if response.status == 200 and ("search_items" in response.url or "api/v4/search" in response.url):
                    data = response.json()
                    captured_data.append(data)
            except Exception:
                pass

        page.on("response", on_response)
        page.goto("https://shopee.co.id/search?keyword=sepatu", timeout=45000)
        page.wait_for_timeout(5000)
        
        with open("shopee_test_dump.json", "w", encoding="utf-8") as f:
            json.dump(captured_data, f, ensure_ascii=False, indent=2)
            
        browser.close()

if __name__ == "__main__":
    test()
