import asyncio, re
from playwright.async_api import async_playwright
REPO = "pizzatano-checkout"

async def main():
    pw = await async_playwright().start()
    b = await pw.chromium.connect_over_cdp("http://127.0.0.1:9222")
    pg = await b.contexts[0].new_page()
    await pg.goto("https://github.com/new", wait_until="domcontentloaded"); await pg.wait_for_timeout(3500)
    if "login" in pg.url or "/sessions" in pg.url:
        print("NOT_LOGGED_IN github:", pg.url); await b.close(); return
    try:
        await pg.get_by_label("Repository name", exact=False).first.fill(REPO); await pg.wait_for_timeout(2000)
        await pg.get_by_role("button", name=re.compile("Create repository", re.I)).first.click()
        await pg.wait_for_url(re.compile(rf"github\.com/[^/]+/{REPO}"), timeout=30000)
        print("CREATED:", pg.url)
    except Exception as e:
        print("ERROR:", str(e)[:200], "| url:", pg.url)
        await pg.screenshot(path="/tmp/pizzatano-verify/gh_err.png", timeout=15000)
    await b.close()
asyncio.run(main())
