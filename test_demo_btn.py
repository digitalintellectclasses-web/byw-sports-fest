import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        page.on('response', lambda response: print(f'<< {response.status} {response.url}'))
        
        await page.goto('https://byw-alpha.vercel.app/', wait_until='networkidle')
        await page.wait_for_timeout(10000)
        
        print('Clicking Demo...')
        btn = page.locator('text="Explore Demo Version"').first
        await btn.click()
        
        await page.wait_for_timeout(5000)
        await page.screenshot(path="e:/projects/byw/demo_click_result.png")
        await browser.close()
        print('Saved screenshot!')

asyncio.run(main())
