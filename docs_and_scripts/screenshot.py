import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://localhost:3000/matches')
        # Wait a bit for react to render
        await page.wait_for_timeout(2000)
        await page.screenshot(path='e:/projects/byw/screenshot.png', full_page=True)
        await browser.close()

asyncio.run(main())
