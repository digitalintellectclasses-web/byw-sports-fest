import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Mobile viewport (iPhone 12 Pro)
        context = await browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            has_touch=True
        )
        
        page = await context.new_page()
        print("Navigating to dashboard...")
        await page.goto('http://localhost:3000')
        
        # Wait for any animations to settle
        await page.wait_for_timeout(2000)
        
        # Take screenshot
        await page.screenshot(path='mobile_dashboard_viewport.png', full_page=False)
        print("Screenshot saved to mobile_dashboard_viewport.png")
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
