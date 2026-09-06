/**
 * Pizzatano — single source of truth for the WhatsApp order handoff.
 * Frontend-only: no backend, no payment gateway. The cart becomes a
 * pre-filled wa.me draft; the kitchen confirms price/total/ETA in chat.
 */

export const BRAND_NAME = "Pizzatano";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pizzatano-kuching.netlify.app";

/** INTERNATIONAL format, digits only, no '+'. MY 016-885 8527 -> 60168858527. */
export const WHATSAPP_NUMBER = "60168858527";
export const PHONE_DISPLAY = "016-885 8527";
export const INSTAGRAM = "pizzatano";
export const INSTAGRAM_URL = "https://www.instagram.com/pizzatano/";
export const CITY = "Kuching, Sarawak";

export const CURRENCY = "RM";
export const formatPrice = (n: number) => `${CURRENCY} ${n.toFixed(2)}`;

export type OrderType = "pickup" | "delivery";

export interface OrderContact {
  name: string;
  /** Delivery address (blank for pickup). */
  address: string;
  /** Requested time, e.g. "7:30pm today" (optional). */
  when: string;
  note: string;
}

export interface OrderItem {
  name: string;
  variant?: string | null;
  quantity: number;
  /** null until the menu price is confirmed — totals are then omitted. */
  unitPrice: number | null;
}

/**
 * Build the WhatsApp draft body (plain text, NOT url-encoded).
 * If ANY item has no confirmed price, the money lines are omitted and the
 * customer is told the total will be confirmed in chat — we never invent a price.
 */
export function buildOrderMessage(contact: OrderContact, items: OrderItem[], type: OrderType): string {
  const L: string[] = [`Hi ${BRAND_NAME}! I'd like to place an order.`, ""];
  L.push(`Name: ${contact.name.trim() || "-"}`);
  L.push(type === "pickup" ? "Order type: Self-pickup" : "Order type: Delivery");
  if (type === "delivery") L.push(`Address: ${contact.address.trim() || "-"}`);
  if (contact.when.trim()) L.push(`Time: ${contact.when.trim()}`);
  L.push("", "Order:");
  items.forEach((it, i) => {
    const v = it.variant ? ` (${it.variant})` : "";
    const money = it.unitPrice != null ? ` - ${formatPrice(it.unitPrice * it.quantity)}` : "";
    L.push(`${i + 1}. ${it.name}${v} x${it.quantity}${money}`);
  });
  const allPriced = items.length > 0 && items.every((it) => it.unitPrice != null);
  if (allPriced) {
    const subtotal = items.reduce((s, it) => s + (it.unitPrice as number) * it.quantity, 0);
    L.push("", `Subtotal: ${formatPrice(subtotal)}`);
    L.push(type === "delivery" ? "Delivery fee: to be confirmed" : "Collection: Self-pickup");
  } else {
    L.push("", "Please confirm the prices and total.");
  }
  if (contact.note.trim()) L.push("", `Note: ${contact.note.trim()}`);
  return L.join("\n");
}

/** The ONLY place the message is URL-encoded. */
export function whatsappOrderLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappEnquiryLink(text = `Hi ${BRAND_NAME}! I'd like to ask about your pizzas.`): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
