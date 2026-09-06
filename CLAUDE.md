# Pizzatano — WhatsApp checkout

Tuak-style WhatsApp store for **Pizzatano** (@pizzatano), wood-fired Neapolitan pizza,
Kuching, Sarawak. Built 2026-09-07 from the `build-whatsapp-store` pattern (Tuak Madis
reference), re-skinned to a wood-fired theme. Dispatched by Nexus on Julius's instruction;
brief + source assets in `command_centre/handoff/pizzatano-checkout/`.

## Commerce model
No backend, no payment. Cart (zustand persist, `{productId, variantKey, qty}` tuples) →
`/checkout` builds a plain-text order → `wa.me/60168858527?text=…` anchor. Kitchen confirms
price/total/ETA in WhatsApp. Pickup or delivery (Kuching) — no fee math (rule unknown).

## Single sources of truth
- `lib/config.ts` — brand, WhatsApp number (`60168858527`), `buildOrderMessage`, `whatsappOrderLink`.
- `lib/catalogue.ts` — 5 pizzas. **Prices are `null` (not published on IG).** Fill `price` per
  variant → totals appear automatically in cart + message. Until then the UI says "Price on WhatsApp".
- `lib/cart.ts` — store + `toView()`; `lib/ui.ts` — drawer state.

## Theme
Tailwind v4 `@theme` tokens in `app/globals.css`: terracotta #C0432A (actions), ember #E8842A
(glow), charcoal #241A16 (hero/footer), cream #F3E7D3 (page), basil #4E7A3A. Fonts self-hosted
via `next/font/local` (Fraunces display + Inter body) in `app/fonts/`.

## Images (from their reels — see handoff/BRIEF.md)
- Hero: `public/images/hero/hero_000044.jpg` (pizza in the flaming oven, 720×1280, has a
  baked-in "Pizzatano Kuching" caption).
- Real product shots: `menu/Dc4_cOSTesA.jpg` = Quattro Formaggi, `menu/Dc4-ycEzFYa.jpg` = Diavola.
- `menu/DcXpy3Uz9Qp.jpg` + `menu/DcWP0eHzv36.jpg` are kitchen/behind-the-scenes shots (dough,
  oven) — used in the Story section, NOT as product photos.
- Margherita / Marinara / Napoli have **no photo** → branded SVG tile (`components/PizzaTile.tsx`).
- Logo is 100×100 only → favicon + nav mark. Need hi-res for anything bigger.

## Stack & commands
Next 16 (App Router, static export → `out/`), Tailwind v4, zustand, sonner, lucide. Node 22.
`npm run dev` / `npm run build` / `npm run start` on port **3970**. Netlify: `netlify.toml` publishes `out/`.

## Pages
`/` (hero, menu grid, story, how-it-works) · `/cart` · `/checkout`. sitemap + robots + Restaurant JSON-LD.

## Open items (need Julius / Pizzatano)
- [ ] Menu prices (and any sizes) → `lib/catalogue.ts`
- [ ] Hi-res logo for the header/hero
- [ ] Full menu (only 5 pizzas confirmed from ~12 recent posts)
- [ ] Delivery rule / fee, opening hours, pickup address
- [ ] Payment: WhatsApp handoff now; say if a real gateway is wanted (then `build-business-website`)
- [ ] Unofficial build — confirm consent with Pizzatano before promoting the public URL
