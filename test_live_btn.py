import asyncio
import time
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        print('Going to live site...')
        await page.goto('https://byw-alpha.vercel.app/', wait_until='networkidle')
        await page.wait_for_timeout(3000)
        
        body_text = await page.evaluate('document.body.innerText')
        if 'Start Real Tournament' in body_text:
            print('Found Real Tournament! Clicking...')
            btn = page.locator('text="Start Real Tournament"').first
            
            async with page.expect_response(lambda r: r.request.method == 'POST', timeout=25000) as resp:
                await btn.click()
            
            r = await resp.value
            print(f"Response: {r.status}")
        
        elif 'Explore Demo Version' in body_text:
            print('Found Demo Version! Clicking...')
            btn = page.locator('text="Explore Demo Version"').first
            
            async with page.expect_response(lambda r: r.request.method == 'POST', timeout=25000) as resp:
                await btn.click()
            
            r = await resp.value
            print(f"Response: {r.status}")
        else:
            print('Neither button found. Page contents:')
            print(body_text[:500])
            
        await browser.close()

asyncio.run(main())
