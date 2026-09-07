"use client";
import { MessageCircle } from "lucide-react";
import { whatsappEnquiryLink, PHONE_DISPLAY } from "@/lib/config";

/** Always-visible tap-to-order button — this business takes every order on WhatsApp. */
export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappEnquiryLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Order on WhatsApp, ${PHONE_DISPLAY}`}
      data-testid="floating-whatsapp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition-transform hover:-translate-y-0.5"
      style={{ background: "#25D366" }}
    >
      <span aria-hidden className="absolute inset-0 rounded-full pz-ping" style={{ background: "#25D366" }} />
      <MessageCircle size={26} className="relative" />
    </a>
  );
}
