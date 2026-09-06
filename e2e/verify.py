"""W-8 / W-10 / W-11 verification for the Pizzatano WhatsApp checkout (static export on :3970)."""
import asyncio, os, urllib.parse, json
from playwright.async_api import async_playwright
BASE = "http://localhost:3970"; OUT = "/tmp/pizzatano-verify"; os.makedirs(OUT, exist_ok=True)
EXPECTED_NUMBER = "60168858527"
FLAGS = ["--no-sandbox", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"]
R = {}

async def routes(b):
    for vp, tag in [({"width": 1440, "height": 900}, "desktop"), ({"width": 412, "height": 915}, "mobile")]:
        for r in ["/", "/cart/", "/checkout/"]:
            ctx = await b.new_context(viewport=vp); pg = await ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            resp = await pg.goto(BASE + r, wait_until="networkidle"); await pg.wait_for_timeout(600)
            hs = await pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
            name = (r.strip("/") or "home")
            await pg.screenshot(path=f"{OUT}/{tag}-{name}.png")
            R[f"{tag} {r}"] = {"status": resp.status, "errors": errs[:3], "hscroll": hs}
            await ctx.close()

async def flow(b):
    ctx = await b.new_context(viewport={"width": 412, "height": 915}); pg = await ctx.new_page(); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto(BASE + "/", wait_until="networkidle")
    # add Diavola x2 and Quattro Formaggi x1 with real clicks
    d = pg.locator('[data-testid="product-diavola"]')
    await d.get_by_label("Increase quantity").click(); await d.get_by_test_id("quick-add").click(); await pg.wait_for_timeout(300)
    await pg.locator('[data-testid="product-quattro-formaggi"]').get_by_test_id("quick-add").click(); await pg.wait_for_timeout(300)
    R["cart_count"] = await pg.get_by_test_id("cart-count").inner_text()
    # open drawer, pixel-read opacity
    await pg.get_by_test_id("open-cart").click(); await pg.wait_for_timeout(500)
    await pg.screenshot(path=f"{OUT}/mobile-drawer.png")
    R["drawer_lines"] = await pg.locator('[data-testid="cart-drawer"] [data-testid="cart-line"]').count()
    from PIL import Image
    img = Image.open(f"{OUT}/mobile-drawer.png").convert("RGB")
    px = [img.getpixel(p) for p in [(60, 400), (350, 400), (60, 800), (350, 800), (206, 650)]]
    R["drawer_avg"] = round(sum(sum(p) / 3 for p in px) / len(px))
    await pg.get_by_test_id("drawer-checkout").click(); await pg.wait_for_url("**/checkout/**"); await pg.wait_for_timeout(500)
    # gating: CTA disabled before name
    R["cta_disabled_before"] = await pg.get_by_test_id("whatsapp-order").get_attribute("aria-disabled")
    await pg.fill('input[name="name"]', "Test Customer")
    await pg.get_by_test_id("type-delivery").click()
    await pg.fill('textarea[name="address"]', "12, Jalan Song, Kuching")
    await pg.fill('input[name="when"]', "7:30pm tonight")
    await pg.wait_for_timeout(300)
    R["cta_disabled_after"] = await pg.get_by_test_id("whatsapp-order").get_attribute("aria-disabled")
    href = await pg.get_by_test_id("whatsapp-order").get_attribute("href")
    num = href.split("wa.me/")[1].split("?")[0]
    text = urllib.parse.unquote(href.split("text=")[1])
    preview = await pg.get_by_test_id("message-preview").inner_text()
    R["w8"] = {"number_ok": num == EXPECTED_NUMBER, "number": num,
               "has_order": "Order:" in text, "has_diavola_x2": "Diavola x2" in text, "has_qf": "Quattro Formaggi x1" in text,
               "delivery": "Order type: Delivery" in text and "Jalan Song" in text, "time": "Time: 7:30pm" in text,
               "prices_omitted_note": "confirm the prices" in text, "preview_matches": preview.strip() == text.strip()}
    R["cta_above_fold"] = await pg.get_by_test_id("whatsapp-order-mobile").evaluate("e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= 915; }")
    R["mobile_cta_href_matches"] = (await pg.get_by_test_id("whatsapp-order-mobile").get_attribute("href")) == href
    await pg.screenshot(path=f"{OUT}/mobile-checkout-filled.png")
    R["decoded_message"] = text; R["flow_errors"] = errs[:3]
    # real wheel scroll on home
    await pg.goto(BASE + "/", wait_until="networkidle")
    for _ in range(8): await pg.mouse.wheel(0, 600); await pg.wait_for_timeout(120)
    R["wheel_scrollY"] = await pg.evaluate("window.scrollY")
    await ctx.close()

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True, args=FLAGS)
        await routes(b); await flow(b); await b.close()
    print(json.dumps(R, indent=1))

asyncio.run(main())
