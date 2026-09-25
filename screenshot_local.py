import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Go to the local page where the WelcomeModal is rendered
        await page.goto('http://localhost:3001/')
        await page.wait_for_timeout(3000)
        await page.screenshot(path='e:/projects/byw/local_screenshot_3001.png', full_page=True)
        await browser.close()

asyncio.run(main())
