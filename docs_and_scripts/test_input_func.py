import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto('http://localhost:3000/matches')
        await page.wait_for_timeout(2000)
        
        # Scroll down
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)
        
        # Find the last match card that is not completed
        # Fill in the scores
        inputs = await page.locator("input[type='text']").all()
        if len(inputs) >= 2:
            print("Found score inputs, typing scores...")
            await inputs[0].fill("21")
            await inputs[1].fill("15")
            
            # Click the first 'Wins' button
            buttons = await page.locator("button:has-text('Wins')").all()
            if buttons:
                print("Clicking win button...")
                await buttons[0].click()
                await page.wait_for_timeout(3000)
                
                # Take screenshot of the result
                await page.screenshot(path='e:/projects/byw/matches_after_score.png', full_page=False)
                print("Screenshot saved.")
            else:
                print("No buttons found.")
        else:
            print("No inputs found.")
            
        await browser.close()

asyncio.run(main())
