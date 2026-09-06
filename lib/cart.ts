"use client";
/**
 * Local cart (zustand persist). Stores ONLY {productId, variantKey, quantity}
 * tuples; names/prices are materialised against the catalogue on read so a
 * returning customer's old cart can never carry a stale price.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById, priceFor, variantLabel } from "@/lib/catalogue";

interface StoredLine { productId: string; variantKey: string; quantity: number; }

const lineKey = (productId: string, variantKey: string) => `${productId}::${variantKey}`;

interface CartStore {
  lines: StoredLine[];
  hydrated: boolean;
  addLine: (productId: string, variantKey: string, quantity: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clearLines: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      addLine: (productId, variantKey, quantity) =>
        set((s) => {
          const hit = s.lines.find((l) => l.productId === productId && l.variantKey === variantKey);
          return hit
            ? { lines: s.lines.map((l) => (l === hit ? { ...l, quantity: l.quantity + quantity } : l)) }
            : { lines: [...s.lines, { productId, variantKey, quantity }] };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (lineKey(l.productId, l.variantKey) === key ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),
      removeLine: (key) => set((s) => ({ lines: s.lines.filter((l) => lineKey(l.productId, l.variantKey) !== key) })),
      clearLines: () => set({ lines: [] }),
    }),
    {
      name: "pizzatano-cart",
      version: 1,
      migrate: () => ({ lines: [] }),
      onRehydrateStorage: () => (state) => { if (state) state.hydrated = true; },
    },
  ),
);

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  variantKey: string;
  variant: string | null;
  image: string | null;
  quantity: number;
  unitPrice: number | null;
  lineSubtotal: number | null;
}

export interface CartView {
  lines: CartLine[];
  itemCount: number;
  /** null when any line's price is unconfirmed. */
  subtotal: number | null;
  allPriced: boolean;
}

function toView(lines: StoredLine[]): CartView {
  const out: CartLine[] = [];
  let count = 0, subtotal = 0, allPriced = true;
  for (const l of lines) {
    const p = getProductById(l.productId);
    if (!p) continue;
    const unit = priceFor(p, l.variantKey);
    const sub = unit != null ? unit * l.quantity : null;
    if (sub == null) allPriced = false; else subtotal += sub;
    count += l.quantity;
    out.push({
      id: lineKey(l.productId, l.variantKey), productId: p.id, name: p.name,
      variantKey: l.variantKey, variant: variantLabel(p, l.variantKey),
      image: p.image, quantity: l.quantity, unitPrice: unit, lineSubtotal: sub,
    });
  }
  return { lines: out, itemCount: count, subtotal: out.length && allPriced ? subtotal : null, allPriced: out.length > 0 && allPriced };
}

export function useCart() {
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartStore((s) => s.hydrated);
  const addLine = useCartStore((s) => s.addLine);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const clearLines = useCartStore((s) => s.clearLines);
  const cart = toView(lines);
  return {
    cart, hasLoaded: hydrated, itemCount: cart.itemCount,
    add: (productId: string, quantity = 1, variantKey = "regular") => addLine(productId, variantKey, quantity),
    updateQuantity: setQuantity, remove: removeLine, clear: clearLines,
  };
}
