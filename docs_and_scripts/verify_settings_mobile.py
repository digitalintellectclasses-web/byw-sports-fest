import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            has_touch=True
        )
        page = await context.new_page()
        
        print("Navigating to settings...")
        await page.goto('http://localhost:3000/settings')
        await page.wait_for_timeout(2000)
        
        await page.screenshot(path='settings_mobile.png', full_page=False)
        print("Screenshot saved to settings_mobile.png")
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
