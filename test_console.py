import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        page.on('console', lambda msg: print(f'CONSOLE: {msg.text}'))
        page.on('pageerror', lambda e: print(f'PAGE ERROR: {e}'))
        
        await page.goto('https://byw-alpha.vercel.app/', wait_until='networkidle')
        await page.wait_for_timeout(3000)
        
        print('Clicking Demo...')
        btn = page.locator('text="Explore Demo Version"').first
        await btn.click()
        await page.wait_for_timeout(5000)
        await browser.close()

asyncio.run(main())
