import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { BRAND_NAME, SITE_URL, CITY, WHATSAPP_NUMBER } from "@/lib/config";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/fraunces-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-fraunces", display: "swap",
});
const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND_NAME} — Wood-fired Neapolitan Pizza, Kuching`, template: `%s · ${BRAND_NAME}` },
  description: "Neapolitan pizza baked in a wood-fired oven in Kuching, Sarawak. 100% Italian flour from Naples and D.O.P white buffalo mozzarella. Order on WhatsApp.",
  openGraph: { type: "website", siteName: BRAND_NAME, images: ["/images/og/og-cover.jpg"] },
  twitter: { card: "summary_large_image" },
};

const organizationLd = {
  "@context": "https://schema.org", "@type": "Restaurant", name: BRAND_NAME, url: SITE_URL,
  servesCuisine: "Neapolitan pizza", address: { "@type": "PostalAddress", addressLocality: "Kuching", addressRegion: "Sarawak", addressCountry: "MY" },
  telephone: `+${WHATSAPP_NUMBER}`, image: `${SITE_URL}/images/og/og-cover.jpg`, description: `Wood-fired Neapolitan pizza in ${CITY}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] btn btn-primary">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster position="bottom-center" richColors />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      </body>
    </html>
  );
}
