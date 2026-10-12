import time
import os
import re
import json
from patchright.sync_api import sync_playwright

PROFILE_DIR = os.path.join(os.getcwd(), "shopee_profile")

with sync_playwright() as p:
    browser = p.chromium.launch_persistent_context(
        user_data_dir=PROFILE_DIR,
        headless=False,
        viewport={"width": 1280, "height": 720}
    )
    page = browser.pages[0] if browser.pages else browser.new_page()
    page.goto("https://shopee.co.id/search?keyword=tas", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(5000)
    
    # Extract page content
    content = page.content()
    
    # Check if item_basic is in the HTML
    print("item_basic in HTML?", "item_basic" in content)
    
    # Let's try to extract JSON from <script> tags
    scripts = page.locator("script").all()
    found = False
    for script in scripts:
        text = script.inner_text()
        if "item_basic" in text:
            print("Found item_basic in a script tag!")
            # Usually it's window.__INITIAL_STATE__ or similar
            print("Snippet:", text[:200])
            found = True
            break
            
    if not found:
        print("Not found in any script tag.")
        
    browser.close()
