import asyncio
from playwright.async_api import async_playwright

BASE = 'https://byw-alpha.vercel.app'

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        
        print("Navigating to homepage...")
        await page.goto(BASE + '/', wait_until='networkidle')
        await page.wait_for_timeout(3000)
        
        # We don't need to click the demo button anymore because it's already seeded!
        # Just check if modal is there and close it if possible, but it shouldn't be there.
        
        await page.screenshot(path='e:/projects/byw/live_verify_dashboard.png')
        print("Dashboard done.")
        
        # Check Matches page
        await page.goto(BASE + '/matches', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='e:/projects/byw/live_verify_matches.png')
        print("Matches done.")
        
        # Filter to SF matches
        try:
            search = page.locator('input[placeholder*="Search"]')
            await search.fill('SF')
            await page.wait_for_timeout(1000)
            await page.screenshot(path='e:/projects/byw/live_verify_sf_matches.png')
            print("SF matches filtered done.")
        except Exception as e:
            print("Filter error:", e)
        
        # Check Standings
        await page.goto(BASE + '/standings', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='e:/projects/byw/live_verify_standings.png', full_page=True)
        print("Standings done.")
        
        await browser.close()
        print("All done!")

asyncio.run(main())
