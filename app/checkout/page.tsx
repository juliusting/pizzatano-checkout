"use client";
/**
 * Checkout — no payment step. Name + pickup/delivery + (address) + time, a LIVE
 * preview of the WhatsApp draft, and a real <a href="https://wa.me/..."> CTA
 * (never window.open — iOS Safari blocks it). Prices absent → totals omitted.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { buildOrderMessage, whatsappOrderLink, formatPrice, type OrderItem, type OrderType, PHONE_DISPLAY, PAYMENT_NOTE, PICKUP_AREA } from "@/lib/config";

const FORM_KEY = "pizzatano-checkout-contact";
interface Form { name: string; address: string; date: string; when: string; note: string; type: OrderType; }
const EMPTY: Form = { name: "", address: "", date: "", when: "", note: "", type: "pickup" };

export default function CheckoutPage() {
  const { cart, hasLoaded } = useCart();
  const [form, setForm] = useState<Form>(EMPTY);

  useEffect(() => { try { const raw = localStorage.getItem(FORM_KEY); if (raw) setForm({ ...EMPTY, ...JSON.parse(raw) }); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(FORM_KEY, JSON.stringify(form)); } catch {} }, [form]);

  const items: OrderItem[] = useMemo(() => cart.lines.map((l) => ({ name: l.name, variant: l.variant, quantity: l.quantity, unitPrice: l.unitPrice })), [cart.lines]);
  const message = useMemo(() => buildOrderMessage({ name: form.name, address: form.address, date: form.date, when: form.when, note: form.note }, items, form.type), [form, items]);
  const ready = cart.lines.length > 0 && form.name.trim().length > 1 && (form.type === "pickup" || form.address.trim().length > 5);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (!hasLoaded) return <div className="container-x pt-32 pb-20 text-ink-muted">Loading…</div>;
  if (cart.lines.length === 0) return (
    <div className="container-x pt-32 pb-20 text-center">
      <h1 className="display text-4xl">Your cart is empty</h1>
      <Link href="/#menu" className="btn btn-primary mt-5">Browse the menu</Link>
    </div>
  );

  return (
    <div className="container-x pt-28 pb-20">
      <Link href="/cart" className="mb-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-muted hover:text-terracotta"><ArrowLeft size={12} /> Back to cart</Link>
      <p className="eyebrow mb-3">Checkout</p>
      <h1 className="display text-4xl md:text-5xl">Send your order on WhatsApp</h1>
      <p className="mt-3 max-w-xl text-ink-muted">Fill in your details and tap the green button. WhatsApp opens with your order already written out, and Pizzatano confirms the total and timing there.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="card flex flex-col gap-4 p-5 md:p-6" onSubmit={(e) => e.preventDefault()}>
          <label className="flex flex-col gap-1.5 text-sm font-medium"><span>Your name <span className="text-terracotta">*</span></span>
            <input name="name" className="field" value={form.name} onChange={set("name")} placeholder="e.g. Aisyah" required /></label>

          <fieldset className="flex flex-col gap-2 text-sm font-medium">
            <legend className="mb-1">Pickup or delivery?</legend>
            <div className="flex gap-2" role="radiogroup">
              {(["pickup", "delivery"] as OrderType[]).map((t) => (
                <button key={t} type="button" role="radio" aria-checked={form.type === t} data-testid={`type-${t}`} onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`btn flex-1 ${form.type === t ? "btn-primary" : "btn-ghost"}`}>{t === "pickup" ? "Self-pickup" : "Delivery (Kuching)"}</button>
              ))}
            </div>
          </fieldset>

          {form.type === "delivery" ? (
            <label className="flex flex-col gap-1.5 text-sm font-medium"><span>Delivery address <span className="text-terracotta">*</span></span>
              <textarea name="address" className="field" rows={3} value={form.address} onChange={set("address")} placeholder="Unit, street, area, Kuching" /></label>
          ) : (
            <p className="rounded-xl border border-rule bg-cream-2 px-4 py-3 text-sm text-ink-muted">{PICKUP_AREA}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">Date <span className="font-normal text-ink-muted">(optional)</span>
              <input name="date" className="field" value={form.date} onChange={set("date")} placeholder="e.g. Fri 12 Sep" /></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">Time <span className="font-normal text-ink-muted">(optional)</span>
              <input name="when" className="field" value={form.when} onChange={set("when")} placeholder="e.g. 7:00pm" /></label>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-medium">Note for the kitchen <span className="font-normal text-ink-muted">(optional)</span>
            <textarea name="note" className="field" rows={2} value={form.note} onChange={set("note")} placeholder="Extra basil, no chilli…" /></label>

          <div>
            <p className="mb-1.5 text-xs uppercase tracking-widest text-ink-muted">Message preview</p>
            <pre data-testid="message-preview" className="whitespace-pre-wrap rounded-xl border border-rule bg-cream-2 p-4 text-xs text-ink" style={{ fontFamily: "ui-monospace, monospace" }}>{message}</pre>
          </div>
        </form>

        <aside className="card h-fit p-5">
          <p className="eyebrow mb-3">Your order</p>
          {cart.lines.map((l) => (
            <div key={l.id} className="flex justify-between gap-3 py-1 text-sm">
              <span className="text-ink-muted">{l.name}{l.variant ? ` (${l.variant})` : ""} ×{l.quantity}</span>
              <span className="font-semibold">{l.lineSubtotal != null ? formatPrice(l.lineSubtotal) : "—"}</span>
            </div>
          ))}
          <div className="my-3 border-t border-rule" />
          <div className="flex justify-between text-sm"><span className="text-ink-muted">Subtotal</span><span className="font-semibold" data-testid="order-subtotal">{cart.subtotal != null ? formatPrice(cart.subtotal) : "Confirmed in chat"}</span></div>
          <p className="mt-1 text-xs text-ink-muted">{form.type === "delivery" ? "Delivery fee and " : ""}final total confirmed on WhatsApp. {PAYMENT_NOTE}</p>
          <a href={whatsappOrderLink(message)} target="_blank" rel="noopener noreferrer" data-testid="whatsapp-order"
            aria-disabled={!ready} tabIndex={ready ? 0 : -1} className="btn btn-whatsapp mt-4 w-full">
            <MessageCircle size={16} /> Send order via WhatsApp
          </a>
          {!ready && <p className="mt-2 text-center text-xs text-ink-muted">Add your name{form.type === "delivery" ? " and address" : ""} to continue.</p>}
          <p className="mt-3 text-center text-xs text-ink-muted">Or message us directly: {PHONE_DISPLAY}</p>
        </aside>
      </div>

      {/* Mobile: keep the CTA reachable above the fold while the form is filled in */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-cream/95 p-3 backdrop-blur lg:hidden" data-testid="mobile-cta-bar">
        <a href={whatsappOrderLink(message)} target="_blank" rel="noopener noreferrer" data-testid="whatsapp-order-mobile"
          aria-disabled={!ready} tabIndex={ready ? 0 : -1} className="btn btn-whatsapp w-full">
          <MessageCircle size={16} /> {ready ? "Send order via WhatsApp" : "Add your name to send"}
        </a>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
