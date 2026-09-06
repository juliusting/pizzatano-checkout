"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useUi } from "@/lib/ui";
import { BRAND_NAME } from "@/lib/config";

export default function Nav() {
  const { itemCount, hasLoaded } = useCart();
  const openDrawer = useUi((s) => s.openDrawer);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // The home hero is charcoal, so the transparent navbar needs light text there.
  const onDark = pathname === "/" && !scrolled;
  const linkCls = `hidden sm:inline text-sm font-medium ${onDark ? "text-on-dark/85 hover:text-on-dark" : "text-ink hover:text-terracotta"}`;
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled ? "bg-cream/95 backdrop-blur border-b border-rule" : "bg-transparent"}`}>
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${BRAND_NAME} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover ring-1 ring-rule" />
          <span className={`display text-xl ${onDark ? "text-on-dark" : "text-ink"}`}>{BRAND_NAME}</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-5">
          <Link href="/#menu" className={linkCls}>Menu</Link>
          <Link href="/#story" className={linkCls}>Our oven</Link>
          <button type="button" onClick={openDrawer} aria-label="Open cart" data-testid="open-cart"
            className="relative inline-flex items-center gap-2 rounded-full border border-rule bg-cream-2 px-3.5 py-2 text-sm font-semibold text-ink hover:border-terracotta">
            <ShoppingBag size={16} /> <span className="hidden sm:inline">Cart</span>
            {hasLoaded && itemCount > 0 && (
              <span data-testid="cart-count" className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-on-dark">{itemCount}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
