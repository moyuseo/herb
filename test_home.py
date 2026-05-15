from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})

    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    page.goto('http://localhost:5173', timeout=15000)
    page.wait_for_load_state('networkidle', timeout=15000)
    page.wait_for_timeout(2000)

    page.screenshot(path='/workspace/test_screenshot.png', full_page=True)

    if errors:
        print("=== PAGE ERRORS ===")
        for e in errors:
            print(e)
    else:
        print("No page errors detected")

    print(f"Page title: {page.title()}")
    print(f"Page URL: {page.url}")

    body_text = page.locator('body').inner_text()
    print(f"Body text length: {len(body_text)}")
    print(f"First 500 chars: {body_text[:500]}")

    browser.close()
