from playwright.sync_api import sync_playwright
import sys

def check_site():
    url = "https://web-app-psi-self.vercel.app"
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            response = page.goto(url, wait_until="networkidle")
            
            print(f"Status Code: {response.status}")
            print(f"Page Title: {page.title()}")
            
            if response.status >= 400:
                print("Error: The page returned an error status code.")
                # print some text
                print(page.locator("body").inner_text()[:500])
            else:
                page.screenshot(path="e:/projects/byw/live_screenshot.png")
                print("Screenshot saved to live_screenshot.png")
                
            browser.close()
        except Exception as e:
            print(f"Exception: {e}")
            sys.exit(1)

if __name__ == "__main__":
    check_site()
