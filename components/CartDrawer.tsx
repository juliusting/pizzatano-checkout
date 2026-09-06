"use client";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useUi } from "@/lib/ui";
import { formatPrice } from "@/lib/config";
import PizzaTile from "@/components/PizzaTile";

export default function CartDrawer() {
  const open = useUi((s) => s.drawerOpen);
  const close = useUi((s) => s.closeDrawer);
  const { cart, updateQuantity, remove } = useCart();
  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}>
      <button type="button" aria-label="Close cart" onClick={close}
        className={`absolute inset-0 bg-charcoal/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside data-testid="cart-drawer" role="dialog" aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="display text-2xl">Your order</h2>
          <button type="button" onClick={close} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream-2"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.lines.length === 0 ? (
            <p className="py-10 text-center text-ink-muted">Nothing here yet. Add a pizza from the menu.</p>
          ) : cart.lines.map((l) => (
            <div key={l.id} className="flex gap-3 border-b border-rule py-3 last:border-0" data-testid="cart-line">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl"><PizzaTile image={l.image} name={l.name} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold leading-snug">{l.name}{l.variant ? ` (${l.variant})` : ""}</p>
                  <button type="button" onClick={() => remove(l.id)} aria-label={`Remove ${l.name}`} className="text-ink-muted hover:text-terracotta"><Trash2 size={15} /></button>
                </div>
                <p className="text-xs text-ink-muted">{l.unitPrice != null ? formatPrice(l.unitPrice) : "Price confirmed on WhatsApp"}</p>
                <div className="mt-2 inline-flex items-center rounded-full border border-rule">
                  <button type="button" aria-label="Decrease" onClick={() => updateQuantity(l.id, l.quantity - 1)} className="grid h-8 w-8 place-items-center"><Minus size={12} /></button>
                  <span className="w-6 text-center text-sm font-semibold" data-testid="line-qty">{l.quantity}</span>
                  <button type="button" aria-label="Increase" onClick={() => updateQuantity(l.id, l.quantity + 1)} className="grid h-8 w-8 place-items-center"><Plus size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-rule px-5 py-4">
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-ink-muted">Subtotal</span>
            <span className="font-semibold" data-testid="drawer-subtotal">{cart.subtotal != null ? formatPrice(cart.subtotal) : "Confirmed in chat"}</span>
          </div>
          <Link href="/checkout" onClick={close} aria-disabled={cart.lines.length === 0}
            className="btn btn-primary w-full" data-testid="drawer-checkout">Checkout via WhatsApp</Link>
          <Link href="/cart" onClick={close} className="mt-2 block text-center text-xs text-ink-muted hover:text-terracotta">View full cart</Link>
        </div>
      </aside>
    </div>
  );
}
