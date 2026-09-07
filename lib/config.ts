/**
 * Pizzatano — single source of truth for the WhatsApp order handoff.
 * Frontend-only: no backend, no payment gateway. The cart becomes a
 * pre-filled wa.me draft; the kitchen confirms the total and sends payment
 * details (bank transfer / QR — cash is not accepted) on confirmation.
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

/** Every pizza is one size. */
export const PIZZA_SIZE = '11–12" · 8 slices';

/** Opening hours (from Pizzatano's official ordering info). */
export const HOURS: { days: string; slots: string[] }[] = [
  { days: "Wednesday – Friday", slots: ["11:30am – 2:30pm", "4:30pm – 7:30pm"] },
  { days: "Saturday", slots: ["3:30pm – 7:30pm"] },
  { days: "Sunday", slots: ["11:30am – 2:00pm", "5:15pm – 7:30pm"] },
];
export const CLOSED_DAYS = "Closed Monday & Tuesday";

export const PICKUP_AREA = "Pickup near Swinburne University, Kuching (exact address shared on confirmation).";
export const DELIVERY_NOTE = "Delivery fee varies by location. Riders and weather can add 30 minutes or more; pickup or self-arranged delivery isn't affected.";
export const PAYMENT_NOTE = "Cashless only — bank transfer or QR. Payment details are shared once your order is confirmed.";

export type OrderType = "pickup" | "delivery";

export interface OrderContact {
  name: string;
  address: string;   // blank for pickup
  date: string;      // requested date (optional)
  when: string;      // requested time (optional)
  note: string;
}

export interface OrderItem {
  name: string;
  variant?: string | null;
  quantity: number;
  unitPrice: number | null;
}

/** Build the WhatsApp draft body (plain text, NOT url-encoded), matching Pizzatano's intake. */
export function buildOrderMessage(contact: OrderContact, items: OrderItem[], type: OrderType): string {
  const L: string[] = [`Hi ${BRAND_NAME}! I'd like to place an order.`, ""];
  L.push(`Name: ${contact.name.trim() || "-"}`);
  if (contact.date.trim()) L.push(`Date: ${contact.date.trim()}`);
  if (contact.when.trim()) L.push(`Time: ${contact.when.trim()}`);
  L.push(type === "pickup" ? "Pickup: near Swinburne University" : `Delivery to: ${contact.address.trim() || "-"}`);
  L.push("", `Order (${PIZZA_SIZE}):`);
  items.forEach((it, i) => {
    const money = it.unitPrice != null ? ` - ${formatPrice(it.unitPrice * it.quantity)}` : "";
    L.push(`${i + 1}. ${it.name} x${it.quantity}${money}`);
  });
  const allPriced = items.length > 0 && items.every((it) => it.unitPrice != null);
  if (allPriced) {
    const subtotal = items.reduce((s, it) => s + (it.unitPrice as number) * it.quantity, 0);
    L.push("", `Subtotal: ${formatPrice(subtotal)}`);
    L.push(type === "delivery" ? "Delivery fee: to be confirmed (varies by location)" : "Collection: self-pickup");
  }
  L.push("", "Payment: bank transfer / QR (please send details to confirm).");
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
