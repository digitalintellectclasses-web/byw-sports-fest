import asyncio
import time
from playwright.async_api import async_playwright

BASE = 'https://byw-alpha.vercel.app'

async def test_button(btn_text, screenshot_name):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Fresh context = no localStorage, modal will show
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        errors = []
        page.on("dialog", lambda d: print(f"ALERT: {d.message}"))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

        print(f"\n--- Testing '{btn_text}' ---")
        await page.goto(BASE + '/', wait_until='networkidle')
        await page.wait_for_timeout(2000)

        await page.screenshot(path=f'e:/projects/byw/{screenshot_name}_before.png')

        # Find the button
        btn = page.locator(f'h3:has-text("{btn_text}")')
        await btn.wait_for(timeout=8000)
        print(f"Button found. Clicking...")

        start = time.time()
        async with page.expect_response(
            lambda r: r.request.method == 'POST' and 'vercel.app' in r.url,
            timeout=25000
        ) as resp_info:
            await btn.click()
        
        response = await resp_info.value
        duration = time.time() - start
        print(f"Server action responded in {duration:.2f}s  |  HTTP {response.status}")

        # Wait for page reload
        await page.wait_for_timeout(4000)
        await page.screenshot(path=f'e:/projects/byw/{screenshot_name}_after.png')

        if errors:
            print(f"Console errors: {errors}")
        else:
            print("No console errors!")

        await browser.close()
        return response.status, duration

async def main():
    s1, d1 = await test_button("Explore Demo Version", "test_demo")
    s2, d2 = await test_button("Start Real Tournament", "test_real")

    print(f"\n=== RESULTS ===")
    print(f"Explore Demo Version  ->  HTTP {s1}  in {d1:.2f}s")
    print(f"Start Real Tournament ->  HTTP {s2}  in {d2:.2f}s")

asyncio.run(main())
