import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("dialog", lambda dialog: print(f"Dialog: {dialog.message}"))
        
        await page.goto('http://localhost:3000/matches')
        await page.wait_for_timeout(2000)
        
        # Find the first 'Wins' button that is not disabled
        buttons = await page.locator("button:has-text('Wins')").all()
        for btn in buttons:
            is_disabled = await btn.is_disabled()
            if not is_disabled:
                print("Clicking button...")
                await btn.click()
                break
                
        await page.wait_for_timeout(3000)
        await page.screenshot(path='e:/projects/byw/after_click.png')
        await browser.close()

asyncio.run(main())
