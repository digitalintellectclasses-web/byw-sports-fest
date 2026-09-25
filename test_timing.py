import asyncio
import time
from playwright.async_api import async_playwright

BASE = 'http://localhost:3007'

async def test_button(btn_text, screenshot_name):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        await page.goto(BASE + '/', wait_until='networkidle')
        await page.wait_for_timeout(2000)

        btn = page.locator(f'h3:has-text("{btn_text}")')
        await btn.wait_for(timeout=8000)
        print(f"Clicking '{btn_text}'...")

        start = time.time()
        async with page.expect_response(
            lambda r: r.request.method == 'POST',
            timeout=60000
        ) as resp_info:
            await btn.click()
        
        response = await resp_info.value
        duration = time.time() - start
        print(f"'{btn_text}' -> HTTP {response.status} in {duration:.2f}s")

        await browser.close()
        return response.status, duration

async def main():
    s1, d1 = await test_button("Start Real Tournament", "test_real")
    print(f"\n=== RESULT ===")
    print(f"Start Real Tournament -> HTTP {s1} in {d1:.2f}s")

asyncio.run(main())
