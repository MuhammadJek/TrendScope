import time
import os
from patchright.sync_api import sync_playwright

PROFILE_DIR = os.path.join(os.getcwd(), "shopee_profile")

with sync_playwright() as p:
    browser = p.chromium.launch_persistent_context(
        user_data_dir=PROFILE_DIR,
        headless=False,
        viewport={"width": 1280, "height": 720}
    )
    page = browser.pages[0] if browser.pages else browser.new_page()
    page.goto("https://shopee.co.id/search?keyword=sepatu", timeout=60000)
    page.wait_for_timeout(5000)
    page.screenshot(path="debug_shopee.png")
    browser.close()
