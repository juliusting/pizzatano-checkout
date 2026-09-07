import Link from "next/link";
import { BRAND_NAME, PHONE_DISPLAY, INSTAGRAM, INSTAGRAM_URL, CITY, whatsappEnquiryLink, HOURS, CLOSED_DAYS } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-on-dark">
      <div className="container-x grid gap-8 py-12 md:grid-cols-4">
        <div>
          <p className="display text-2xl">{BRAND_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-on-dark-muted">Wood-fired Neapolitan pizza in {CITY}. 100% Italian flour from Naples, D.O.P white buffalo mozzarella.</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Hours</p>
          <ul className="space-y-1.5 text-on-dark-muted">
            {HOURS.map((h) => (
              <li key={h.days}><span className="text-on-dark">{h.days}</span><br />{h.slots.join(" · ")}</li>
            ))}
            <li className="text-on-dark-muted/80">{CLOSED_DAYS}</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Order</p>
          <ul className="space-y-1.5 text-on-dark-muted">
            <li><a className="hover:text-on-dark" href={whatsappEnquiryLink()} target="_blank" rel="noopener noreferrer">WhatsApp {PHONE_DISPLAY}</a></li>
            <li><Link className="hover:text-on-dark" href="/#menu">Menu</Link></li>
            <li><Link className="hover:text-on-dark" href="/checkout">Checkout</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Follow</p>
          <ul className="space-y-1.5 text-on-dark-muted">
            <li><a className="hover:text-on-dark" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram @{INSTAGRAM}</a></li>
            <li><a className="hover:text-on-dark" href={`https://www.threads.net/@${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">Threads @{INSTAGRAM}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-on-dark/15">
        <p className="container-x py-4 text-xs text-on-dark/50">© {new Date().getFullYear()} {BRAND_NAME}, {CITY}. Orders are confirmed over WhatsApp.</p>
      </div>
    </footer>
  );
}
