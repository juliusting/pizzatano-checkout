"""Netlify Import-from-Git wizard + Step 6 (badge off), via the logged-in CDP Chrome."""
import asyncio, re
from playwright.async_api import async_playwright
REPO, PROJECT = "pizzatano-checkout", "pizzatano-kuching"
SHOT = "/tmp/pizzatano-verify"

async def shot(pg, n):
    try: await pg.screenshot(path=f"{SHOT}/nl-{n}.png", animations="disabled", timeout=15000)
    except Exception as e: print(f"  (shot {n} skipped: {str(e)[:50]})")

async def main():
    pw = await async_playwright().start()
    b = await pw.chromium.connect_over_cdp("http://127.0.0.1:9222")
    pg = await b.contexts[0].new_page()
    await pg.goto("https://app.netlify.com/start", wait_until="domcontentloaded"); await pg.wait_for_timeout(4000)
    if "login" in pg.url: print("NOT_LOGGED_IN netlify"); await b.close(); return
    try: await pg.get_by_role("button", name=re.compile(r"GitHub", re.I)).first.click(); await pg.wait_for_timeout(4000)
    except Exception as e: print("  github click:", str(e)[:80])
    try:
        await pg.get_by_placeholder(re.compile("Search", re.I)).first.fill(REPO); await pg.wait_for_timeout(2500)
        await pg.get_by_text(re.compile(REPO, re.I)).first.click(); await pg.wait_for_timeout(4000)
    except Exception as e: print("  repo select:", str(e)[:100])
    print("configure url:", pg.url); await shot(pg, "configure")
    try:
        f = pg.get_by_label(re.compile(r"(Project|Site) name", re.I)).first
        if await f.count(): await f.fill(PROJECT); await pg.wait_for_timeout(1500)
    except Exception as e: print("  name:", str(e)[:80])
    try: await pg.get_by_role("button", name=re.compile(r"^\s*Deploy", re.I)).first.click(); await pg.wait_for_timeout(6000)
    except Exception as e: print("  deploy click:", str(e)[:100])
    print("deploy url:", pg.url); await shot(pg, "deployed")
    slug = pg.url.split("/projects/")[1].split("/")[0] if "/projects/" in pg.url else PROJECT
    # Step 6 — Powered by Netlify badge OFF (memory feedback_netlify_badge_off)
    await pg.goto(f"https://app.netlify.com/projects/{slug}/configuration/general", wait_until="domcontentloaded"); await pg.wait_for_timeout(2800)
    await pg.evaluate("""() => { for (const c of [...document.querySelectorAll('div,section')]
      .filter(e=>/Powered by Netlify badge/i.test(e.textContent||'')&&e.querySelector('button'))
      .sort((a,b)=>a.textContent.length-b.textContent.length)) {
        const b=[...c.querySelectorAll('button')].find(x=>/^\\s*configure\\s*$/i.test(x.textContent||''));
        if(b){b.scrollIntoView({block:'center'});b.click();return;} } }""")
    await pg.wait_for_timeout(1200)
    cb = pg.get_by_label(re.compile("Show the badge on this project", re.I)).first
    if await cb.count():
        if await cb.is_checked(): await cb.uncheck()
        await pg.get_by_role("button", name="Save", exact=True).first.click(timeout=6000); await pg.wait_for_timeout(1800)
    body = await pg.evaluate("document.body.innerText")
    m = re.search(r"badge is (not )?shown on this project", body, re.I)
    print("badge state:", m.group(0) if m else "unknown", "| slug:", slug)
    await b.close()
asyncio.run(main())
