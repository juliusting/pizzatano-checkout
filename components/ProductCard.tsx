"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalogue";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import PizzaTile from "@/components/PizzaTile";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [vIdx, setVIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const variant = product.variants[vIdx];
  const hasChoice = product.variants.length > 1;

  function handleAdd() {
    add(product.id, qty, variant.key);
    toast.success(`${product.name} × ${qty} added`);
    setQty(1); setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className="card flex h-full flex-col overflow-hidden" data-testid={`product-${product.id}`}>
      <div className="relative">
        <PizzaTile image={product.image} name={product.name} />
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-dark">{product.badge}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="display text-xl">{product.name}</h3>
            <span className="text-sm font-semibold text-terracotta-deep whitespace-nowrap" data-testid="price">
              {variant.price != null ? formatPrice(variant.price) : "Price on WhatsApp"}
            </span>
          </div>
          {product.italian && <p className="text-xs italic text-ink-muted" style={{ fontFamily: "var(--font-fraunces)" }}>{product.italian}</p>}
          <p className="mt-1.5 text-sm text-ink-muted">{product.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{product.tags.map((t) => <span key={t} className={`tag ${/veg/i.test(t) ? "tag-basil" : ""}`}>{t}</span>)}</div>
        </div>
        {hasChoice && (
          <div className="flex gap-2" role="group" aria-label="Choose size">
            {product.variants.map((v, i) => (
              <button key={v.key} type="button" aria-pressed={i === vIdx} onClick={() => setVIdx(i)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${i === vIdx ? "border-terracotta bg-terracotta text-on-dark" : "border-rule text-ink-muted"}`}>{v.label}</button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <div className="inline-flex items-center rounded-full border border-rule">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center"><Minus size={14} /></button>
            <span className="w-6 text-center text-sm font-semibold" aria-label="Quantity">{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center"><Plus size={14} /></button>
          </div>
          <button type="button" onClick={handleAdd} data-testid="quick-add" className="btn btn-primary flex-1">
            {justAdded ? <Check size={15} /> : <ShoppingBag size={15} />} {justAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
