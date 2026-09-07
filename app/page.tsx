import Link from "next/link";
import { Flame, Wheat, MessageCircle } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, anyPriceUnconfirmed } from "@/lib/catalogue";
import { BRAND_NAME, CITY, PHONE_DISPLAY, whatsappEnquiryLink } from "@/lib/config";

export default function Home() {
  return (
    <>
      {/* Hero — full-bleed finished-pizza-in-oven still (top reel Db-vl3bT0yI); food above the fold */}
      <section className="relative isolate flex min-h-[93vh] items-end overflow-hidden bg-charcoal text-on-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero/hero_000044.jpg" alt={`A Neapolitan pizza baking beside open flames in ${BRAND_NAME}'s wood-fired oven`} width={720} height={1280} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(20,14,10,0.60) 0%, rgba(20,14,10,0.12) 30%, rgba(20,14,10,0.60) 68%, rgba(20,14,10,0.93) 100%)" }} />
        <div className="container-x relative z-10 pb-16 pt-28">
          <p className="eyebrow mb-4 text-ember">Wood-fired · Neapolitan · {CITY}</p>
          <h1 className="display max-w-[15ch] text-[clamp(2.7rem,8vw,5.6rem)]" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}>
            Baked in fire.<br /><span className="italic font-medium text-ember">Born in Naples.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-on-dark-muted" style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}>
            Hand-stretched dough from 100% Italian flour and D.O.P white buffalo mozzarella, about 60 seconds in a 450°C wood-fired oven. Made in Kuching, the Napoli way.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/#menu" className="btn btn-primary">See the menu</Link>
            <a href={whatsappEnquiryLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><MessageCircle size={16} /> WhatsApp {PHONE_DISPLAY}</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-dark-muted">
            <li className="flex items-center gap-2"><Wheat size={16} className="text-ember" /> 100% Italian flour from Naples</li>
            <li className="flex items-center gap-2"><Flame size={16} className="text-ember anim-ember" /> Wood-fired, blistered crust</li>
          </ul>
        </div>
      </section>

      {/* Provenance — the trust story, straight from their captions */}
      <section aria-label="What goes into every pizza" className="border-y border-rule bg-cream-2">
        <div className="container-x grid gap-6 py-8 sm:grid-cols-3">
          {[
            ["100% Italian flour", "Milled and shipped from Naples"],
            ["D.O.P buffalo mozzarella", "Italian white buffalo, protected origin"],
            ["Wood-fired at 450°C", "Blistered and ready in about 60 seconds"],
          ].map(([t, d]) => (
            <div key={t} className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
              <span aria-hidden className="mb-2 mt-1 h-2 w-2 shrink-0 rounded-full bg-terracotta sm:mb-0" />
              <div>
                <p className="font-semibold text-ink">{t}</p>
                <p className="text-sm text-ink-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="container-x scroll-mt-20 py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">The menu</p>
            <h2 className="display text-4xl md:text-5xl">Five pizzas, one oven</h2>
          </div>
          {anyPriceUnconfirmed() && <p className="max-w-xs text-sm text-ink-muted">Prices are confirmed when you order on WhatsApp.</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Story / oven */}
      <section id="story" className="scroll-mt-20 bg-cream-2">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/menu/DcXpy3Uz9Qp.jpg" alt="Dough being hand-stretched in the Pizzatano kitchen" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl" style={{ aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/menu/DcWP0eHzv36.jpg" alt="Topping a pizza beside the mosaic wood-fired oven" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="eyebrow mb-3">Our oven</p>
            <h2 className="display text-4xl md:text-5xl">Stretched by hand, finished by fire</h2>
            <p className="mt-4 text-ink-muted">Every base is stretched by hand, topped to order and slid into a wood-fired oven that runs hot enough to blister the crust in about a minute. That is what gives a true Neapolitan its leopard spots, soft centre and smoky edge.</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><Wheat size={16} className="mt-0.5 text-terracotta" /> 100% Italian flour from Naples</li>
              <li className="flex gap-2"><Flame size={16} className="mt-0.5 text-terracotta" /> 100% Italian white buffalo mozzarella, D.O.P</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How ordering works */}
      <section className="container-x py-16 md:py-20">
        <p className="eyebrow mb-3">How it works</p>
        <h2 className="display text-4xl">Order in three taps</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["Pick your pizzas", "Add what you'd like to the cart and choose pickup or delivery in Kuching."],
            ["Send on WhatsApp", "Checkout opens WhatsApp with your order already written out. Just hit send."],
            ["We confirm & bake", `${BRAND_NAME} replies with the total and timing, then fires your pizzas.`],
          ].map(([t, d], i) => (
            <li key={t} className="card p-5">
              <span className="display text-3xl text-terracotta">0{i + 1}</span>
              <p className="mt-2 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-ink-muted">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8"><Link href="/#menu" className="btn btn-primary">Start an order</Link></div>
      </section>
    </>
  );
}
