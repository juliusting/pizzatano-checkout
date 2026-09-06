"use client";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import PizzaTile from "@/components/PizzaTile";

export default function CartPage() {
  const { cart, hasLoaded, updateQuantity, remove, clear } = useCart();
  if (!hasLoaded) return <div className="container-x pt-32 pb-20 text-ink-muted">Loading…</div>;
  return (
    <div className="container-x pt-28 pb-20">
      <p className="eyebrow mb-3">Your cart</p>
      <h1 className="display text-4xl md:text-5xl">Ready to send?</h1>
      {cart.lines.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <p className="text-ink-muted">Your cart is empty.</p>
          <Link href="/#menu" className="btn btn-primary mt-4">Browse the menu</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="card divide-y divide-rule">
            {cart.lines.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-4" data-testid="cart-line">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"><PizzaTile image={l.image} name={l.name} /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{l.name}{l.variant ? ` (${l.variant})` : ""}</p>
                  <p className="text-xs text-ink-muted">{l.unitPrice != null ? `${formatPrice(l.unitPrice)} each` : "Price confirmed on WhatsApp"}</p>
                  <div className="mt-2 inline-flex items-center rounded-full border border-rule">
                    <button type="button" aria-label="Decrease" onClick={() => updateQuantity(l.id, l.quantity - 1)} className="grid h-9 w-9 place-items-center"><Minus size={13} /></button>
                    <span className="w-6 text-center text-sm font-semibold">{l.quantity}</span>
                    <button type="button" aria-label="Increase" onClick={() => updateQuantity(l.id, l.quantity + 1)} className="grid h-9 w-9 place-items-center"><Plus size={13} /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{l.lineSubtotal != null ? formatPrice(l.lineSubtotal) : "—"}</p>
                  <button type="button" onClick={() => remove(l.id)} aria-label={`Remove ${l.name}`} className="mt-2 text-ink-muted hover:text-terracotta"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          <aside className="card h-fit p-5">
            <div className="flex justify-between text-sm"><span className="text-ink-muted">Subtotal</span><span className="font-semibold">{cart.subtotal != null ? formatPrice(cart.subtotal) : "Confirmed in chat"}</span></div>
            <p className="mt-1 text-xs text-ink-muted">Delivery fee and final total are confirmed on WhatsApp.</p>
            <Link href="/checkout" className="btn btn-primary mt-4 w-full">Checkout via WhatsApp</Link>
            <button type="button" onClick={() => clear()} className="mt-3 w-full text-center text-xs text-ink-muted hover:text-terracotta">Clear cart</button>
          </aside>
        </div>
      )}
    </div>
  );
}
