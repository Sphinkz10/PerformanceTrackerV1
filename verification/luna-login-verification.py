from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000/luna-login')
    # wait for the app to render the component (since we had an error before, we wait)
    page.wait_for_timeout(3000)
    page.screenshot(path='/home/jules/verification/luna-login-verification.png')
    browser.close()
