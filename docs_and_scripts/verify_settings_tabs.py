import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()
        
        print("Navigating to settings...")
        await page.goto('http://localhost:3000/settings')
        await page.wait_for_timeout(1000)
        
        print("Clicking Add Participant...")
        await page.click('text="Add Participant"')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='settings_add.png', full_page=False)

        print("Clicking Danger Zone...")
        await page.click('text="Danger Zone"')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='settings_danger.png', full_page=False)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
