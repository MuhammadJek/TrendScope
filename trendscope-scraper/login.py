import time
import os
from playwright.sync_api import sync_playwright

PROFILE_DIR = os.path.join(os.getcwd(), "shopee_profile")

print("Membuka browser untuk login Shopee...")
print("Silahkan login menggunakan akun Shopee Anda.")
print("Setelah berhasil login dan melihat halaman depan Shopee, tutup browser untuk menyimpan sesi.")

with sync_playwright() as p:
    browser = p.chromium.launch_persistent_context(
        user_data_dir=PROFILE_DIR,
        headless=False,
        args=[
            "--disable-blink-features=AutomationControlled",
            "--no-sandbox"
        ],
        viewport={"width": 1280, "height": 720}
    )
    page = browser.pages[0] if browser.pages else browser.new_page()
    page.goto("https://shopee.co.id/buyer/login")
    
    print("Browser terbuka! Silahkan login...")
    
    try:
        # Wait until the user closes the browser
        page.wait_for_timeout(0)
    except Exception:
        pass
    
print("Sesi Shopee berhasil disimpan di folder shopee_profile!")

