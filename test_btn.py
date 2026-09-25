import asyncio
import time
from playwright.async_api import async_playwright

BASE = 'http://localhost:3006'

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        await page.goto(BASE + '/')
        await page.wait_for_timeout(3000)
        
        btn = page.locator('h3:has-text("Explore Demo Version")')
        await btn.wait_for(timeout=10000)
        print("Clicking...")
        start = time.time()
        
        async with page.expect_response(lambda r: r.request.method == 'POST', timeout=20000) as response_info:
            await btn.click()
            
        response = await response_info.value
        duration = time.time() - start
        print(f"Server action took {duration:.2f} seconds. Status: {response.status}")
        
        await browser.close()

asyncio.run(main())
