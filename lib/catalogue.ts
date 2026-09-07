/**
 * Pizzatano menu — verbatim from their official menu (August 2026), 11–12"/8 slices.
 * Prices in RM. Real reel photos where we have them; the rest use an appetite-forward
 * per-style illustrated tile (components/PizzaTile.tsx), never a borrowed photo.
 */
export type TileKind = "margherita" | "marinara" | "napoli" | "quattro" | "diavola";

export interface Variant { key: string; label: string; price: number | null; }
export interface Product {
  id: string;
  slug: string;
  name: string;
  italian?: string;
  description: string;
  tags: string[];
  image: string | null;
  tile: TileKind;
  variants: Variant[];
  badge?: string;
}

const rm = (price: number): Variant[] => [{ key: "regular", label: "Regular", price }];

// Recurring premium note on most pies, kept out of every description for brevity:
// "Parmigiano Reggiano D.O.P (24 months) & extra-virgin olive oil."
export const PRODUCTS: Product[] = [
  {
    id: "marinara", slug: "marinara", name: "Marinara",
    description: "Fresh tomato sauce, oregano, garlic and extra-virgin olive oil. No cheese, all flavour.",
    tags: ["Vegan"], image: "/images/menu/marinara.jpg", tile: "marinara", variants: rm(48),
  },
  {
    id: "margherita", slug: "margherita", name: "Margherita",
    description: "Mozzarella, basil, Parmigiano Reggiano D.O.P (24 months) and extra-virgin olive oil.",
    tags: ["Vegetarian"], image: "/images/menu/margherita.jpg", tile: "margherita", variants: rm(48),
  },
  {
    id: "funghi", slug: "funghi", name: "Funghi",
    description: "Fresh button mushrooms, mozzarella, basil, Parmigiano Reggiano D.O.P (24 months), E.V.O.O.",
    tags: ["Vegetarian"], image: null, tile: "quattro", variants: rm(58),
  },
  {
    id: "pepperoni", slug: "pepperoni", name: "Pepperoni",
    description: "Beef pepperoni, mozzarella, basil, Parmigiano Reggiano D.O.P (24 months), E.V.O.O.",
    tags: ["Beef"], image: null, tile: "diavola", variants: rm(63),
  },
  {
    id: "hawaiian", slug: "hawaiian", name: "Hawaiian",
    description: "Chicken ham, minced chicken, fresh pineapple, mozzarella, Parmigiano Reggiano D.O.P (24 months).",
    tags: ["Chicken"], image: null, tile: "quattro", variants: rm(63),
  },
  {
    id: "diavola", slug: "diavola", name: "Diavola",
    description: "Italian beef salami, mozzarella, basil, Parmigiano Reggiano D.O.P (24 months), E.V.O.O.",
    tags: ["Beef"], image: "/images/menu/Dc4-ycEzFYa.jpg", tile: "diavola", variants: rm(78),
  },
  {
    id: "margherita-dop", slug: "margherita-dop", name: "Margherita D.O.P", italian: "La bufala",
    description: "Mozzarella di Bufala Campana D.O.P, basil and extra-virgin olive oil.",
    tags: ["Vegetarian"], image: null, tile: "margherita", variants: rm(78), badge: "D.O.P",
  },
  {
    id: "napoli", slug: "napoli", name: "Napoli",
    description: "Anchovies, mozzarella, olives, capers, oregano, basil, Parmigiano Reggiano D.O.P (24 months).",
    tags: ["Seafood"], image: null, tile: "napoli", variants: rm(86),
  },
  {
    id: "quattro-formaggi", slug: "quattro-formaggi", name: "Quattro Formaggi D.O.P", italian: "Four cheese",
    description: "Fior di Latte, Taleggio D.O.P, Gorgonzola D.O.P, Parmigiano Reggiano D.O.P (24 months), basil.",
    tags: ["Vegetarian", "Cheese lovers"], image: "/images/menu/Dc4_cOSTesA.jpg", tile: "quattro", variants: rm(88), badge: "D.O.P",
  },
  {
    id: "capricciosa", slug: "capricciosa", name: "Capricciosa",
    description: "Italian smoked turkey ham, mozzarella, artichoke, black olives, button mushrooms, basil, Parmigiano Reggiano D.O.P.",
    tags: ["Turkey"], image: null, tile: "napoli", variants: rm(98),
  },
];

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const priceFor = (p: Product, variantKey: string): number | null =>
  p.variants.find((v) => v.key === variantKey)?.price ?? null;
export const variantLabel = (p: Product, variantKey: string): string | null =>
  p.variants.length > 1 ? (p.variants.find((v) => v.key === variantKey)?.label ?? null) : null;
export const anyPriceUnconfirmed = () => PRODUCTS.some((p) => p.variants.some((v) => v.price == null));
