from playwright.sync_api import sync_playwright

def test_visuals():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 1080})
        
        try:
            page.goto("http://localhost:3000/matches", wait_until="networkidle")
            page.wait_for_timeout(2000)
            
            # Click the theme toggle button - it has an onClick and contains the Sun/Moon icons
            # The button is inside DesktopNav. Let's find the button by clicking the last button in the header
            page.locator("header button").last.click()
            page.wait_for_timeout(1000)
            
            page.screenshot(path="matches_dark_mode.png", full_page=False)
            
            page.goto("http://localhost:3000/standings", wait_until="networkidle")
            page.wait_for_timeout(1000)
            page.screenshot(path="standings_dark_mode.png", full_page=False)
            
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    test_visuals()
